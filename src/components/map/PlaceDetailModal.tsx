/**
 * Detail modal opened from the map page.
 *
 * Triggers:
 *  1. Clicking the "상세 보기" button inside `<MapPlaceCard>`
 *  2. Clicking the "상세 보기" link inside the Naver-Map InfoWindow
 *     (the InfoWindow is plain HTML, so it calls `window.__anibusOpenDetail`
 *      which is installed by `MapPage`)
 *
 * Built on shadcn `<Dialog>` which already provides:
 *   - role="dialog" + aria-modal="true"
 *   - focus trap
 *   - ESC key closes
 *   - background click closes
 *   - X close button
 */

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_META } from "@/data/shops";
import { useI18n } from "@/i18n/I18nProvider";
import { isOpenNow } from "@/lib/openNow";
import { localizeHours } from "@/lib/localizeHours";
import {
  ExternalLink,
  Globe,
  Instagram,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import type { Place } from "./MapPlaceCard";

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
}

// Mirrors the building map already used elsewhere (ShopCard.tsx)
const BUILDING_TRANSLATION_KEYS: Record<string, string> = {
  "삼정타워": "building_samjung",
};

export function PlaceDetailModal({ place, onClose }: PlaceDetailModalProps) {
  const { t, lang } = useI18n();

  // Render nothing when there is no selected place — the Dialog itself
  // also stays closed because `open={!!place}`.
  const open = !!place;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent
        className="max-w-2xl w-[calc(100vw-1.5rem)] max-h-[90vh] overflow-y-auto p-0 gap-0 sm:rounded-2xl"
        // Hide the description visually but keep it in the DOM for a11y
        aria-describedby={undefined}
      >
        {place && <PlaceDetailContent place={place} />}
        {/* Live region — read out by SR when the modal opens */}
        <DialogTitle className="sr-only">
          {place ? (place.name[lang] ?? place.name.ko) : t("detail_title")}
        </DialogTitle>
        <DialogDescription className="sr-only">{t("detail_title")}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function PlaceDetailContent({ place }: { place: Place }) {
  const { t, lang } = useI18n();
  const meta = CATEGORY_META[place.category];

  const title = place.name[lang] ?? place.name.ko;
  const address =
    "addressEn" in place && lang !== "ko" && place.addressEn
      ? place.addressEn
      : place.address;
  const rawHours =
    "hoursEn" in place && lang !== "ko" && place.hoursEn ? place.hoursEn : place.hours;
  const hours = rawHours ? localizeHours(rawHours, t, lang) : "";
  const openState = "hours" in place ? isOpenNow(place.hours) : null;

  const displayBuilding =
    "building" in place && place.building
      ? BUILDING_TRANSLATION_KEYS[place.building]
        ? t(BUILDING_TRANSLATION_KEYS[place.building])
        : place.building
      : undefined;

  const hoursNote =
    "hoursNote" in place && place.hoursNote
      ? place.hoursNote[lang] ?? place.hoursNote.ko
      : undefined;
  const contactNote =
    "contactNote" in place && place.contactNote
      ? place.contactNote[lang] ?? place.contactNote.ko
      : undefined;
  const notes =
    "notes" in place && place.notes ? place.notes[lang] ?? place.notes.ko : undefined;
  const badge =
    "badge" in place && place.badge ? place.badge[lang] ?? place.badge.ko : undefined;

  // Tag rendering — same fallback as ShopCard: unknown keys (brand names) pass through.
  const tags = "tags" in place && place.tags ? place.tags : [];

  return (
    <>
      {/* Hero image */}
      {place.image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-muted sm:h-56">
          <img
            src={place.image}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
          {/* Category strip at bottom of hero — matches the ShopCard accent */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: `hsl(var(--${meta.color}))` }}
          />
        </div>
      )}

      <div className="p-5 flex flex-col gap-4 sm:p-6">
        {/* Optional badge (e.g. newly opened / specialty) */}
        {badge && (
          <div className="rounded-xl bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border border-primary/20 px-3 py-2">
            <p className="text-xs font-bold text-primary leading-snug text-balance">
              {badge}
            </p>
          </div>
        )}

        {/* Title block */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none" aria-hidden="true">
              {meta.emoji}
            </span>
            <h2 className="text-xl font-extrabold leading-tight text-foreground sm:text-2xl">
              {title}
            </h2>
          </div>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {meta[lang] ?? meta.ko}
            {displayBuilding && (
              <>
                {" · "}
                <span className="text-primary">🏢 {displayBuilding}</span>
                {"floor" in place && place.floor && ` ${place.floor}`}
              </>
            )}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[11px] font-semibold"
              >
                {t(tag)}
              </Badge>
            ))}
          </div>
        )}

        {/* Info grid */}
        <div className="flex flex-col gap-2 text-sm">
          <p className="flex items-start gap-2">
            <MapPin
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="leading-snug">{address}</span>
          </p>

          {hours && (
            <p className="flex items-start gap-2">
              <span className="mt-0.5 h-4 w-4 flex-shrink-0 text-center text-sm leading-4">
                🕒
              </span>
              <span className="leading-snug">
                {hours}
                {openState !== null && (
                  <Badge
                    variant={openState ? "default" : "secondary"}
                    className={`ml-2 text-[10px] font-bold ${
                      openState
                        ? "bg-green-500 text-white hover:bg-green-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {openState ? t("open_now") : t("closed")}
                  </Badge>
                )}
              </span>
            </p>
          )}

          {hoursNote && (
            <p className="pl-6 text-xs text-primary italic">· {hoursNote}</p>
          )}

          {"phone" in place && place.phone && (
            <p className="flex items-center gap-2">
              <Phone
                className="h-4 w-4 flex-shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <a
                href={`tel:${place.phone.replace(/[^0-9+]/g, "")}`}
                className="font-medium text-foreground hover:text-primary"
              >
                {place.phone}
              </a>
            </p>
          )}

          {contactNote && (
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs italic text-primary leading-relaxed">
              {contactNote}
            </p>
          )}

          {notes && (
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground leading-relaxed">
              {notes}
            </p>
          )}
        </div>

        {/* Social icons */}
        {("instagram" in place && place.instagram) ||
        ("twitter" in place && place.twitter) ||
        ("homepage" in place && place.homepage) ? (
          <div className="flex flex-wrap gap-2">
            {"instagram" in place && place.instagram && (
              <Button asChild size="sm" variant="secondary" className="text-xs">
                <a
                  href={`https://instagram.com/${place.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="mr-1.5 h-3.5 w-3.5" />@{place.instagram}
                </a>
              </Button>
            )}
            {"twitter" in place && place.twitter && (
              <Button asChild size="sm" variant="outline" className="text-xs">
                <a
                  href={`https://x.com/${place.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="mr-1.5 h-3.5 w-3.5" />@{place.twitter}
                </a>
              </Button>
            )}
            {"homepage" in place && place.homepage && (
              <Button asChild size="sm" variant="outline" className="text-xs">
                <a
                  href={place.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="mr-1.5 h-3.5 w-3.5" />
                  {t("homepage_label")}
                </a>
              </Button>
            )}
          </div>
        ) : null}

        {/* Map links — Naver Map first (per spec, primary source of truth) */}
        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
          {"naverMap" in place && place.naverMap && (
            <Button
              asChild
              size="default"
              className="flex-1 bg-[#03C75A] text-white hover:bg-[#03C75A]/90"
            >
              <a href={place.naverMap} target="_blank" rel="noopener noreferrer">
                <MapPin className="mr-1.5 h-4 w-4" />
                {t("detail_view_naver_map")}
              </a>
            </Button>
          )}
          {"googleMap" in place && place.googleMap && (
            <Button asChild size="default" variant="outline" className="flex-1">
              <a
                href={place.googleMap}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-1.5 h-4 w-4" />
                {t("detail_view_google_map")}
              </a>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
