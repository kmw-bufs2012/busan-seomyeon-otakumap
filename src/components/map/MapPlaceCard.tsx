import { CATEGORY_META } from "@/data/shops";
import type { Cafe, Shop } from "@/data/types";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { ChevronRight, MapPin } from "lucide-react";

type Place = (Shop | Cafe) & { _kind: "shop" | "cafe" };

interface MapPlaceCardProps {
  place: Place;
  active: boolean;
  /** Clicking the card body — pans the map to this place. */
  onClick: () => void;
  /** Clicking the "View details" pill — opens the detail modal. */
  onDetail?: () => void;
}

export function MapPlaceCard({ place, active, onClick, onDetail }: MapPlaceCardProps) {
  const { t, lang } = useI18n();
  const meta = CATEGORY_META[place.category];
  const title = place.name[lang] ?? place.name.ko;
  const address =
    "addressEn" in place && lang !== "ko" && place.addressEn ? place.addressEn : place.address;

  return (
    // We use a plain <div> (not a <button>) because we now have a nested
    // "View details" button — buttons cannot be nested. The container is
    // still keyboard-operable through the underlying clickable region.
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "w-full text-left rounded-xl border bg-card text-card-foreground transition-all cursor-pointer",
        "hover:border-primary/60 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        active
          ? "border-primary shadow-card ring-2 ring-primary/40"
          : "border-border"
      )}
      aria-pressed={active}
    >
      <div className="flex gap-3 p-3">
        {place.image && (
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
            <img
              src={place.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none" aria-hidden="true">
              {meta.emoji}
            </span>
            <h3 className="truncate font-bold text-sm">{title}</h3>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {meta[lang] ?? meta.ko}
          </p>
          <p className="mt-0.5 flex items-start gap-1 text-[11px] text-muted-foreground">
            <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{address}</span>
          </p>

          {/* "View details" pill — its own click target so the surrounding
              card click can pan the map without opening the modal. */}
          {onDetail && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDetail();
              }}
              className="mt-2 inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-primary to-fuchsia-500 px-2.5 py-1 text-[10px] font-bold text-primary-foreground transition-smooth hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
              aria-label={`${t("map_view_details")} — ${title}`}
            >
              {t("map_view_details")}
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export type { Place };
