import { Cafe } from "@/data/types";
import { CATEGORY_META } from "@/data/shops";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Instagram, MapPin, Info, Twitter, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CafeCard({ cafe }: { cafe: Cafe }) {
  const { lang, t } = useI18n();
  const [imgErr, setImgErr] = useState(false);
  const meta = CATEGORY_META[cafe.category];
  const name = cafe.name[lang] ?? cafe.name.ko;
  const warning = cafe.warning[lang] ?? cafe.warning.ko;
  const badge = cafe.badge?.[lang] ?? cafe.badge?.ko;
  const notes = cafe.notes?.[lang] ?? cafe.notes?.ko;

  const displayAddress = (lang !== "ko" && cafe.addressEn) ? cafe.addressEn : cafe.address;
  const displayHours = (lang !== "ko" && cafe.hoursEn) ? cafe.hoursEn : cafe.hours;

  return (
    <article className="group relative flex flex-col rounded-2xl border-2 overflow-hidden bg-card shadow-card transition-smooth hover:scale-[1.01] hover:shadow-glow"
      style={{ borderColor: `hsl(var(--${meta.color}) / 0.3)` }}>

      {/* representative photo */}
      {cafe.image && !imgErr && (
        <div className="h-44 overflow-hidden">
          <img
            src={cafe.image}
            alt={name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          />
        </div>
      )}

      {/* large category banner */}
      <div className="px-5 py-4 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, hsl(var(--${meta.color})), hsl(var(--${meta.color}) / 0.7))` }}>
        <div className="flex items-start justify-between gap-3 relative">
          <div>
            <div className="text-3xl mb-1">{meta.emoji}</div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-90">
              {meta[lang as keyof typeof meta] as string ?? meta.en}
            </p>
            <h3 className="text-xl font-extrabold leading-tight mt-1 text-balance">{name}</h3>
            {badge && <p className="text-xs mt-1 font-semibold opacity-95">{badge}</p>}
          </div>
          <div className="text-right">
            <div className="font-bold tracking-wider">
              {"₩".repeat(cafe.priceLevel)}<span className="opacity-30">{"₩".repeat(3 - cafe.priceLevel)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* WARNING block */}
      <div className="px-5 py-3 bg-warning/10 border-y-2 border-warning/40">
        <p className="flex items-start gap-2 text-warning-foreground font-semibold text-sm leading-snug">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-warning" />
          <span>{warning}</span>
        </p>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* address + hours */}
        <div className="space-y-1 text-sm">
          <p className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
            <span className="text-muted-foreground">{displayAddress}</span>
          </p>
          <p className="text-xs text-muted-foreground pl-6">🕒 {displayHours}</p>
        </div>

        {notes && <p className="text-xs text-muted-foreground italic">{notes}</p>}
      </div>

      {/* footer */}
      <footer className="grid grid-cols-2 gap-2 p-3 bg-muted/30 border-t border-border">
        {cafe.instagram && (
          <Button asChild className="col-span-2 sm:col-span-1 text-xs h-10 font-bold gradient-cafe text-white border-0 hover:opacity-90">
            <a href={`https://instagram.com/${cafe.instagram}`} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4 mr-1.5" /> @{cafe.instagram}
            </a>
          </Button>
        )}
        {cafe.twitter && (
          <Button asChild size="sm" variant="outline" className="text-xs h-10">
            <a href={`https://x.com/${cafe.twitter}`} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-3.5 w-3.5 mr-1" /> @{cafe.twitter}
            </a>
          </Button>
        )}
        <Button asChild size="sm" variant="outline" className="text-xs h-10">
          <a href={cafe.naverMap} target="_blank" rel="noopener noreferrer">
            <MapPin className="h-3.5 w-3.5 mr-1" /> {t("naver_map")}
          </a>
        </Button>
        {cafe.kakaoMap && (
          <Button asChild size="sm" variant="outline" className="text-xs h-10">
            <a href={cafe.kakaoMap} target="_blank" rel="noopener noreferrer">
              <MapPin className="h-3.5 w-3.5 mr-1" /> {t("kakao_map")}
            </a>
          </Button>
        )}
        <Button asChild size="sm" variant="outline" className="text-xs h-10">
          <a href={`https://www.google.com/maps/search/${encodeURIComponent(cafe.address)}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5 mr-1" /> Google
          </a>
        </Button>
      </footer>
    </article>
  );
}
