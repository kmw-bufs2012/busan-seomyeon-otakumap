/**
 * Open-now logic for KST (UTC+9). Parses Korean hour strings like:
 *   "11:00–21:40 연중무휴"
 *   "12:00–20:00 월 휴무"
 *   "평일 14:00–22:00 / 주말 13:00–22:00"
 *   "10:30–23:00 (LO 22:30)"
 * Returns true=open, false=closed, null=unknown.
 */

const KO_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function nowKST(): { day: number; minutes: number } {
  // KST = UTC+9
  const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
  const kst = new Date(utc + 9 * 3600000);
  return { day: kst.getDay(), minutes: kst.getHours() * 60 + kst.getMinutes() };
}

function parseHM(s: string): number | null {
  const m = s.match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

/** Extract all "HH:MM–HH:MM" intervals from string. */
function extractIntervals(s: string): [number, number][] {
  const re = /(\d{1,2}:\d{2})\s*[–\-~]\s*(\d{1,2}:\d{2})/g;
  const out: [number, number][] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    const a = parseHM(m[1]);
    const b = parseHM(m[2]);
    if (a != null && b != null) out.push([a, b]);
  }
  return out;
}

/** Check if today is a "휴무" (closed) day for given string. */
function isClosedToday(s: string, day: number): boolean {
  // matches "월 휴무" "월·화 휴무" etc.
  const m = s.match(/([일월화수목금토][일월화수목금토·,\s]*)\s*휴무/);
  if (!m) return false;
  const today = KO_DAYS[day];
  return m[1].includes(today);
}

export function isOpenNow(hours: string | undefined): boolean | null {
  if (!hours) return null;
  if (/시간\s*미확인|확인\s*필요|SNS|미정/.test(hours)) return null;

  const { day, minutes } = nowKST();
  if (isClosedToday(hours, day)) return false;

  // Pick segment relevant to today (weekday/weekend split)
  let segment = hours;
  const isWeekend = day === 0 || day === 6;
  const weekdayMatch = hours.match(/평일\s*([^\/]+)/);
  const weekendMatch = hours.match(/주말\s*([^\/]+)/);
  if (isWeekend && weekendMatch) segment = weekendMatch[1];
  else if (!isWeekend && weekdayMatch) segment = weekdayMatch[1];

  const intervals = extractIntervals(segment);
  if (intervals.length === 0) {
    // Fall back to all intervals from the whole string
    const all = extractIntervals(hours);
    if (all.length === 0) return null;
    return all.some(([a, b]) => inRange(minutes, a, b));
  }
  return intervals.some(([a, b]) => inRange(minutes, a, b));
}

function inRange(m: number, a: number, b: number): boolean {
  if (b === 0) b = 24 * 60; // 24:00
  if (b <= a) {
    // overnight (e.g. 22:00–02:00)
    return m >= a || m <= b;
  }
  return m >= a && m <= b;
}

export function statusLabel(open: boolean | null, t: (k: string) => string): string {
  if (open === true) return t("open_now");
  if (open === false) return t("closed");
  return t("hours_unknown");
}
