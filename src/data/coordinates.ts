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
  "one-figure-2":       { lat: 35.1542033, lng: 129.0600499 }, // verified by user
  "gacha-ocean":        { lat: 35.1538864, lng: 129.0600382 }, // [GMaps]
  "brother-young":      { lat: 35.1535431, lng: 129.0600532 }, // [GMaps]

  // ── 중앙대로680번길 / 인근 ──
  "brother-seomyeon":   { lat: 35.1535845, lng: 129.0593794 }, // [GMaps]
  "anime-club":         { lat: 35.1536447, lng: 129.0595202 }, // [GMaps]
  "omochaland":         { lat: 35.1537421, lng: 129.0616167 }, // [GMaps] 45-5 2F
  "anigeo":             { lat: 35.1535545, lng: 129.0604552 }, // [GMaps]
  "anime-ocean":        { lat: 35.155034, lng: 129.059477 }, // verified by user via Naver Map
  "ani-on":             { lat: 35.153926, lng: 129.061481 }, // verified by user via Google Maps
  // 중앙대로680번길 45-9 — verified by user via Google Maps
  "figure-warehouse":   { lat: 35.153894, lng: 129.061630 },
  // 중앙대로680번길 45-5 — verified by user via Google Maps
  "kuji-ya":            { lat: 35.153782, lng: 129.061633 },

  // ── 외곽 서면 / 전포 ──
  "ouji-otaku":             { lat: 35.157007, lng: 129.057543 }, // verified by user via Naver Map
  // 전포대로209번길 39 — verified by user via Google Maps
  "the-goods":              { lat: 35.155332, lng: 129.063092 },
  "kodawari":               { lat: 35.154719, lng: 129.059953 }, // verified by user via Google Maps
  "kuji-land":              { lat: 35.151462, lng: 129.061107 }, // verified by user via Google Maps
  // 동천로108번길 6 — verified by user via Google Maps
  "kuji-shop":              { lat: 35.158235, lng: 129.062676 },
  "gacha-shop-seomyeon":    { lat: 35.155445, lng: 129.060450 }, // verified by user via Google Maps
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
