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
  "j-goods":            { lat: 35.1537300, lng: 129.0599800 },
  "one-figure":         { lat: 35.1536592, lng: 129.0600483 }, // [GMaps]
  "gacha-ocean":        { lat: 35.1538864, lng: 129.0600382 }, // [GMaps]
  "brother-young":      { lat: 35.1535431, lng: 129.0600532 }, // [GMaps]

  // ── 중앙대로680번길 / 인근 ──
  "brother-seomyeon":   { lat: 35.1535845, lng: 129.0593794 }, // [GMaps]
  "anime-club":         { lat: 35.1536447, lng: 129.0595202 }, // [GMaps]
  "omochaland":         { lat: 35.1538200, lng: 129.0599200 },
  "anigeo":             { lat: 35.1539200, lng: 129.0598500 },
  "anime-ocean":        { lat: 35.1542000, lng: 129.0590000 },
  "ani-on":             { lat: 35.1540500, lng: 129.0598000 },
  "figure-warehouse":   { lat: 35.1538800, lng: 129.0599400 },
  "kuji-ya":            { lat: 35.1538200, lng: 129.0599200 },

  // ── 외곽 서면 / 전포 ──
  "ouji-otaku":             { lat: 35.1556000, lng: 129.0593000 },
  "the-goods":              { lat: 35.1505000, lng: 129.0623000 },
  "kodawari":               { lat: 35.1556000, lng: 129.0610000 },
  "kuji-land":              { lat: 35.1525000, lng: 129.0591000 },
  "kuji-shop":              { lat: 35.1500000, lng: 129.0640000 },
  "gacha-shop-seomyeon":    { lat: 35.1554000, lng: 129.0593000 },
};

export const CAFE_COORDS: Record<string, { lat: number; lng: number }> = {
  "dream-maid": { lat: 35.1505000, lng: 129.0633000 },
  "maid-moon":  { lat: 35.1537000, lng: 129.0600000 },
};

/** Seomyeon district center used as the default map center. */
export const SEOMYEON_CENTER = { lat: 35.1530, lng: 129.0596 };
export const SEOMYEON_DEFAULT_ZOOM = 16;
