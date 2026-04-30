import { CATEGORY_META } from "@/data/shops";
import type { Cafe, Shop } from "@/data/types";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

type Place = (Shop | Cafe) & { _kind: "shop" | "cafe" };

interface MapPlaceCardProps {
  place: Place;
  active: boolean;
  onClick: () => void;
}

export function MapPlaceCard({ place, active, onClick }: MapPlaceCardProps) {
  const { lang } = useI18n();
  const meta = CATEGORY_META[place.category];
  const title = place.name[lang] ?? place.name.ko;
  const address =
    "addressEn" in place && lang !== "ko" && place.addressEn ? place.addressEn : place.address;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border bg-card text-card-foreground transition-all",
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
        </div>
      </div>
    </button>
  );
}

export type { Place };
