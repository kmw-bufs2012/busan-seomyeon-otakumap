import { useEffect, useRef } from "react";
import { CATEGORY_META } from "@/data/shops";
import { SEOMYEON_CENTER, SEOMYEON_DEFAULT_ZOOM } from "@/data/coordinates";
import { useI18n } from "@/i18n/I18nProvider";
import { TRANSLATIONS } from "@/i18n/translations";
import type { Place } from "./MapPlaceCard";

interface PlaceWithCoords {
  place: Place;
  lat: number;
  lng: number;
}

interface NaverMapViewProps {
  /** Filtered places to render as markers. */
  places: PlaceWithCoords[];
  /** ID of the currently active/selected place (controlled by parent). */
  activeId: string | null;
  /** Callback when the user clicks a marker. */
  onMarkerClick: (id: string) => void;
}

const COLOR_BY_CATEGORY: Record<string, string> = {
  anime:      "#ec4899", // 굿즈샵 → 핑크
  figure:     "#a855f7", // 피규어 → 보라
  gacha:      "#eab308", // 가챠 → 노랑
  cafecollab: "#0ea5e9", // 카페·콜라보 → 하늘색
  arttoy:     "#6b7280", // 기타 → 회색
  maid:       "#6b7280",
  butler:     "#6b7280",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildInfoWindowHtml(
  pc: PlaceWithCoords,
  lang: string,
  dict: Record<string, string>
): string {
  const { place } = pc;
  const meta = CATEGORY_META[place.category];
  const name = place.name[lang as keyof typeof place.name] ?? place.name.ko;
  const hours =
    "hoursEn" in place && lang !== "ko" && place.hoursEn ? place.hoursEn : place.hours;

  // Resolve tags to current language; brand-name tags pass through unchanged.
  const tagsHtml = "tags" in place && place.tags
    ? place.tags
        .slice(0, 3)
        .map((tag) => {
          const label = dict[tag] ?? tag;
          return `<span style="display:inline-block;padding:2px 8px;font-size:10px;font-weight:600;border-radius:9999px;background:#f1f5f9;color:#0f172a;margin-right:4px;margin-top:4px;">${escapeHtml(
            label
          )}</span>`;
        })
        .join("")
    : "";

  const phone =
    "phone" in place && place.phone
      ? `<a href="tel:${escapeHtml(
          place.phone.replace(/[^0-9+]/g, "")
        )}" style="display:inline-flex;align-items:center;gap:4px;color:#0ea5e9;text-decoration:none;font-size:11px;font-weight:600;margin-top:6px;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            ${escapeHtml(place.phone)}
          </a>`
      : "";

  const socialLinks: string[] = [];
  if ("instagram" in place && place.instagram) {
    socialLinks.push(
      `<a href="https://instagram.com/${escapeHtml(
        place.instagram
      )}" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:#fdf2f8;color:#db2777;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
      </a>`
    );
  }
  if ("twitter" in place && place.twitter) {
    socialLinks.push(
      `<a href="https://x.com/${escapeHtml(
        place.twitter
      )}" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" style="display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:#f1f5f9;color:#0f172a;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>`
    );
  }
  const socialHtml = socialLinks.length
    ? `<div style="display:flex;gap:6px;margin-top:8px;">${socialLinks.join("")}</div>`
    : "";

  const detailLabel = escapeHtml(dict["map_view_details"] ?? "View details");

  return `
    <div style="font-family:inherit;color:#0f172a;padding:12px 14px 12px;max-width:240px;line-height:1.45;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
        <span style="font-size:18px;line-height:1;">${meta.emoji}</span>
        <strong style="font-size:14px;">${escapeHtml(name)}</strong>
      </div>
      <div style="font-size:11px;color:#64748b;margin-bottom:6px;">${escapeHtml(
        meta[lang as keyof typeof meta] as string ?? meta.ko
      )}</div>
      ${
        hours
          ? `<div style="font-size:11px;color:#475569;margin-top:4px;">🕒 ${escapeHtml(hours)}</div>`
          : ""
      }
      ${phone}
      ${tagsHtml ? `<div style="margin-top:6px;">${tagsHtml}</div>` : ""}
      ${socialHtml}
      <a href="#" data-anibus-detail="${escapeHtml(place.id)}" style="display:inline-block;margin-top:10px;padding:6px 12px;font-size:11px;font-weight:700;color:#fff;background:linear-gradient(135deg,#ec4899,#a855f7);border-radius:9999px;text-decoration:none;cursor:pointer;">
        ${detailLabel} →
      </a>
    </div>
  `;
}

function buildMarkerIcon(category: string): { content: string; size: number } {
  const color = COLOR_BY_CATEGORY[category] ?? "#6b7280";
  const meta = CATEGORY_META[category as keyof typeof CATEGORY_META];
  const emoji = meta?.emoji ?? "📍";
  return {
    content: `
      <div style="position:relative;width:34px;height:42px;">
        <div style="
          position:absolute;left:0;top:0;width:34px;height:34px;
          border-radius:50%;
          background:${color};
          border:3px solid #fff;
          box-shadow:0 4px 10px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;
          font-size:16px;line-height:1;">
          ${emoji}
        </div>
        <div style="
          position:absolute;left:50%;top:30px;
          width:0;height:0;
          margin-left:-6px;
          border-left:6px solid transparent;
          border-right:6px solid transparent;
          border-top:10px solid ${color};
          filter:drop-shadow(0 2px 2px rgba(0,0,0,0.2));"></div>
      </div>
    `,
    size: 42,
  };
}

export function NaverMapView({ places, activeId, onMarkerClick }: NaverMapViewProps) {
  const { lang } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infoWindowRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listenersRef = useRef<any[]>([]);
  const onMarkerClickRef = useRef(onMarkerClick);

  // Keep latest callback in a ref so the (one-shot) marker setup doesn't
  // need to re-bind on every re-render.
  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  });

  // Initialize map once
  useEffect(() => {
    const naver = window.naver?.maps;
    if (!naver || !containerRef.current) return;

    mapRef.current = new naver.Map(containerRef.current, {
      center: new naver.LatLng(SEOMYEON_CENTER.lat, SEOMYEON_CENTER.lng),
      zoom: SEOMYEON_DEFAULT_ZOOM,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.Position.RIGHT_BOTTOM,
      },
    });
    infoWindowRef.current = new naver.InfoWindow({
      borderWidth: 0,
      backgroundColor: "#ffffff",
      anchorSize: new naver.Size(10, 10),
      pixelOffset: new naver.Point(0, -8),
    });

    // InfoWindow content is plain HTML, so we use event delegation on the
    // map container to intercept clicks on the "View details" link and
    // call the React-installed window bridge instead of navigating.
    const container = containerRef.current;
    const onContainerClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      const link = target?.closest<HTMLElement>("[data-anibus-detail]");
      if (!link) return;
      ev.preventDefault();
      const id = link.getAttribute("data-anibus-detail");
      if (!id) return;
      const bridge = (window as unknown as { __anibusOpenDetail?: (id: string) => void })
        .__anibusOpenDetail;
      if (bridge) bridge(id);
    };
    container.addEventListener("click", onContainerClick);

    return () => {
      container.removeEventListener("click", onContainerClick);
      // Clear listeners
      listenersRef.current.forEach((l) => naver.Event.removeListener(l));
      listenersRef.current = [];
      // Clear markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current.clear();
      if (infoWindowRef.current) infoWindowRef.current.close();
      infoWindowRef.current = null;
      mapRef.current = null;
    };
  }, []);

  // Sync markers whenever the visible places change
  useEffect(() => {
    const naver = window.naver?.maps;
    const map = mapRef.current;
    if (!naver || !map) return;

    const next = new Set(places.map((p) => p.place.id));
    const dict = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] ?? TRANSLATIONS.ko;

    // Remove markers no longer in the list
    markersRef.current.forEach((marker, id) => {
      if (!next.has(id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    });

    places.forEach((pc) => {
      const existing = markersRef.current.get(pc.place.id);
      const position = new naver.LatLng(pc.lat, pc.lng);
      if (existing) {
        existing.setPosition(position);
        return;
      }
      const icon = buildMarkerIcon(pc.place.category);
      const marker = new naver.Marker({
        position,
        map,
        title: pc.place.name[lang as keyof typeof pc.place.name] ?? pc.place.name.ko,
        icon: {
          content: icon.content,
          size: new naver.Size(34, icon.size),
          anchor: new naver.Point(17, icon.size),
        },
      });
      const listener = naver.Event.addListener(marker, "click", () => {
        onMarkerClickRef.current(pc.place.id);
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(buildInfoWindowHtml(pc, lang, dict));
          infoWindowRef.current.open(map, marker);
        }
      });
      listenersRef.current.push(listener);
      markersRef.current.set(pc.place.id, marker);
    });
    // We intentionally don't depend on `lang` for marker creation (icons
    // don't change with language); language is read fresh from the closure
    // when an InfoWindow is opened via the activeId effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);

  // Open the info window for the active place + pan/zoom map
  useEffect(() => {
    const naver = window.naver?.maps;
    const map = mapRef.current;
    const iw = infoWindowRef.current;
    if (!naver || !map || !iw) return;

    if (!activeId) {
      iw.close();
      return;
    }
    const pc = places.find((p) => p.place.id === activeId);
    const marker = markersRef.current.get(activeId);
    if (!pc || !marker) return;

    const dict = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] ?? TRANSLATIONS.ko;
    iw.setContent(buildInfoWindowHtml(pc, lang, dict));
    iw.open(map, marker);

    map.panTo(new naver.LatLng(pc.lat, pc.lng));
    if (map.getZoom() < 17) map.setZoom(17);
  }, [activeId, places, lang]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{ minHeight: 320 }}
      aria-label="Map"
    />
  );
}
