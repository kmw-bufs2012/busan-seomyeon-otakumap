import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { CAFE_COORDS, SHOP_COORDS } from "@/data/coordinates";
import { CAFES, SHOPS } from "@/data/shops";
import type { Cafe, Shop } from "@/data/types";
import { useI18n } from "@/i18n/I18nProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MapFilterBar, type MapFilter } from "@/components/map/MapFilterBar";
import { MapPlaceCard, type Place } from "@/components/map/MapPlaceCard";
import { NaverMapView } from "@/components/map/NaverMapView";
import { useNaverMapsLoader } from "@/components/map/useNaverMapsLoader";

/** Decide which filter bucket a place falls under. */
function bucketFor(category: Place["category"]): MapFilter {
  if (category === "anime") return "anime";
  if (category === "figure") return "figure";
  if (category === "gacha") return "gacha";
  return "other";
}

/** Combine SHOPS + CAFES with their coordinates and a `_kind` discriminator. */
function buildPlaces(): { place: Place; lat: number; lng: number }[] {
  const out: { place: Place; lat: number; lng: number }[] = [];
  SHOPS.forEach((s: Shop) => {
    const c = SHOP_COORDS[s.id];
    if (!c) return; // skip places without coordinates
    out.push({ place: { ...s, _kind: "shop" } as Place, lat: c.lat, lng: c.lng });
  });
  CAFES.forEach((c: Cafe) => {
    const co = CAFE_COORDS[c.id];
    if (!co) return;
    out.push({ place: { ...c, _kind: "cafe" } as Place, lat: co.lat, lng: co.lng });
  });
  return out;
}

const MapPage = () => {
  const { t } = useI18n();
  const { state: loaderState, error: loaderError } = useNaverMapsLoader();
  const [filter, setFilter] = useState<MapFilter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Update the document title for SEO/UX.
  useEffect(() => {
    const original = document.title;
    document.title = `${t("map_page_title")} · ANIBUS`;
    return () => {
      document.title = original;
    };
  }, [t]);

  const allPlaces = useMemo(() => buildPlaces(), []);
  const counts = useMemo<Record<MapFilter, number>>(() => {
    const c: Record<MapFilter, number> = {
      all: allPlaces.length,
      anime: 0,
      figure: 0,
      gacha: 0,
      other: 0,
    };
    allPlaces.forEach(({ place }) => {
      c[bucketFor(place.category)] += 1;
    });
    return c;
  }, [allPlaces]);

  const visiblePlaces = useMemo(
    () =>
      filter === "all"
        ? allPlaces
        : allPlaces.filter(({ place }) => bucketFor(place.category) === filter),
    [allPlaces, filter]
  );

  // If the active place gets filtered out, clear it so the InfoWindow closes.
  useEffect(() => {
    if (activeId && !visiblePlaces.some(({ place }) => place.id === activeId)) {
      setActiveId(null);
    }
  }, [activeId, visiblePlaces]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Sticky top bar — mirrors the main page layout so language /
          theme controls stay accessible from /map. */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-bold text-muted-foreground backdrop-blur transition-smooth hover:text-foreground"
              aria-label={t("map_back_to_main")}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("map_back_to_main")}</span>
            </Link>
            <span className="font-extrabold">
              <span className="text-2xl">🎌</span>{" "}
              <span className="hidden sm:inline">{t("map_page_title")}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Construction warning banner — appears under the nav, above the map.
          Bright red so users immediately understand coordinates may be inaccurate. */}
      <div
        role="alert"
        className="w-full bg-red-600 px-4 py-3 text-center text-lg font-bold text-white shadow-md md:text-xl"
      >
        {t("map_warning")}
      </div>

      {/* Main layout: PC = sidebar left + map right; mobile = map top + list bottom */}
      <main className="flex flex-1 flex-col md:flex-row">
        {/* List column (desktop sidebar / mobile bottom sheet) */}
        <aside
          className="order-2 flex flex-col border-t border-border bg-background md:order-1 md:w-80 md:flex-shrink-0 md:border-r md:border-t-0"
          aria-label={t("map_list_label")}
        >
          <div className="border-b border-border p-3">
            <MapFilterBar value={filter} onChange={setFilter} counts={counts} />
            <p className="mt-2 text-[11px] text-muted-foreground">
              {t("map_show_count").replace("{count}", String(visiblePlaces.length))}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 md:max-h-[calc(100vh-64px-96px)]">
            <ul className="flex flex-col gap-2">
              {visiblePlaces.map(({ place }) => (
                <li key={`${place._kind}-${place.id}`}>
                  <MapPlaceCard
                    place={place}
                    active={activeId === place.id}
                    onClick={() => setActiveId(place.id)}
                  />
                </li>
              ))}
              {visiblePlaces.length === 0 && (
                <li className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  —
                </li>
              )}
            </ul>
          </div>
        </aside>

        {/* Map column. Naver Maps requires an explicit height — we use 50vh
            on mobile and fill the remaining viewport on md+ screens. */}
        <section
          className="order-1 relative w-full md:order-2 md:flex-1"
          aria-label={t("map_page_title")}
        >
          <div className="relative h-[50vh] w-full bg-muted md:h-[calc(100vh-64px)]">
            {loaderState === "ready" ? (
              <NaverMapView
                places={visiblePlaces}
                activeId={activeId}
                onMarkerClick={setActiveId}
              />
            ) : (
              <MapPlaceholder state={loaderState} error={loaderError} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

function MapPlaceholder({
  state,
  error,
}: {
  state: "idle" | "loading" | "ready" | "error";
  error?: string;
}) {
  const { t } = useI18n();
  if (state === "error") {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-sm rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-destructive" />
          <p className="text-sm font-bold text-foreground">{t("map_error")}</p>
          {error && (
            <p className="mt-2 text-[11px] text-muted-foreground">{error}</p>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span>{t("map_loading")}</span>
      </div>
    </div>
  );
}

export default MapPage;
