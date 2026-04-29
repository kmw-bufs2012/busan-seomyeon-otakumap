import { Lang } from "@/i18n/translations";

/**
 * Replace day-of-week / status tokens in an hours string with the localized
 * equivalents from the translation dictionary. We support both Korean source
 * tokens (e.g. "연중무휴", "금·토") and English source tokens (e.g. "Open daily",
 * "Fri·Sat") so that whichever copy is shown (`hours` or `hoursEn`) gets
 * tokens swapped consistently.
 *
 * The raw Korean / English copy is kept as-is for `ko` and `en`.
 */
export function localizeHours(
  text: string | undefined,
  t: (key: string) => string,
  lang: Lang
): string {
  if (!text) return text ?? "";
  if (lang === "ko" || lang === "en") return text;

  const allYear = t("hours_all_year");
  const friSat = t("hours_fri_sat");

  let out = text;
  // Korean source tokens
  out = out.replace(/연중무휴/g, allYear);
  out = out.replace(/금[·•・]토/g, friSat);
  // English source tokens (case-insensitive, allow common separators / spacing)
  out = out.replace(/Open\s*daily/gi, allYear);
  out = out.replace(/Fri\s*[·•・]\s*Sat/gi, friSat);
  return out;
}
