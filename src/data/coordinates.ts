/**
 * Approximate coordinates for shops and cafés in the Seomyeon district.
 *
 * - Coordinates marked with [GMaps] are extracted from the Google Maps
 *   URLs already present in `shops.ts`.
 * - The remaining values are best-effort approximations derived from
 *   the address (서면/전포 area, Busan).
 *
 * For pinpoint accuracy, the InfoWindow's "상세 보기" link sends the
 * user to the main page where the shop's exact Naver / Kakao / Google
 * map link is rendered.
 *
 * NOTE: This file is intentionally separate from `shops.ts` to keep
 * existing data untouched per project rules.
 */
export const SHOP_COORDS: Record<string, { lat: number; lng: number }> = {
  // ── 삼정타워 (672 Jungang-daero) ──
  "animate-busan":      { lat: 35.1529753, lng: 129.0595645 }, // [GMaps]
  "animate-cafe":       { lat: 35.1529753, lng: 129.0595645 },
  "aniplus-shop":       { lat: 35.1529425, lng: 129.0595638 }, // [GMaps]
  "popmart-samjung":    { lat: 35.1529425, lng: 129.0595638 },
  "smg-goods":          { lat: 35.1529425, lng: 129.0595638 },

  // ── 신천대로50번길 ──
  "j-goods":            { lat: 35.153675, lng: 129.059841 }, // verified by user via Naver Map
  "one-figure":         { lat: 35.1536592, lng: 129.0600483 }, // [GMaps]
  "gacha-ocean":        { lat: 35.1538864, lng: 129.0600382 }, // [GMaps]
  "brother-young":      { lat: 35.1535431, lng: 129.0600532 }, // [GMaps]

  // ── 중앙대로680번길 / 인근 ──
  "brother-seomyeon":   { lat: 35.1535845, lng: 129.0593794 }, // [GMaps]
  "anime-club":         { lat: 35.1536447, lng: 129.0595202 }, // [GMaps]
  "omochaland":         { lat: 35.1537421, lng: 129.0616167 }, // [GMaps] 45-5 2F
  "anigeo":             { lat: 35.1535545, lng: 129.0604552 }, // [GMaps]
  "anime-ocean":        { lat: 35.155034, lng: 129.059477 }, // verified by user via Naver Map
  "ani-on":             { lat: 35.154720, lng: 129.060215 }, // verified by user via Naver Map
  // 중앙대로680번길 45-9 — verified by user via Naver Map
  "figure-warehouse":   { lat: 35.153889, lng: 129.061628 },
  // 중앙대로680번길 45-5 — verified by user via Naver Map
  "kuji-ya":            { lat: 35.153911, lng: 129.061518 },

  // ── 외곽 서면 / 전포 ──
  "ouji-otaku":             { lat: 35.157007, lng: 129.057543 }, // verified by user via Naver Map
  // 전포대로209번길 39 — verified by user via Naver Map
  "the-goods":              { lat: 35.154715, lng: 129.063352 },
  "kodawari":               { lat: 35.155525, lng: 129.059169 }, // verified by user via Naver Map
  "kuji-land":              { lat: 35.151904, lng: 129.062158 }, // verified by user via Naver Map
  // 동천로108번길 6 — verified by user via Naver Map
  "kuji-shop":              { lat: 35.158910, lng: 129.063995 },
  "gacha-shop-seomyeon":    { lat: 35.155923, lng: 129.058731 }, // verified by user via Naver Map
};

export const CAFE_COORDS: Record<string, { lat: number; lng: number }> = {
  // 중앙대로692번길 46 B1 — 전포역 7번 출구 인근 (estimate)
  "dream-maid": { lat: 35.1543000, lng: 129.0612000 },
  // 중앙대로692번길 21 2층 (updated address) — same street as dream-maid
  "maid-moon":  { lat: 35.1545000, lng: 129.0610000 },
};

/** Seomyeon district center used as the default map center. */
export const SEOMYEON_CENTER = { lat: 35.1530, lng: 129.0596 };
export const SEOMYEON_DEFAULT_ZOOM = 16;
