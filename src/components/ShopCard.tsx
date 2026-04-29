import { useMemo, useState } from "react";
import { Shop } from "@/data/types";
import { CATEGORY_META } from "@/data/shops";
import { useI18n } from "@/i18n/I18nProvider";
import { isOpenNow } from "@/lib/openNow";
import { localizeHours } from "@/lib/localizeHours";

// Map raw building identifiers (kept in Korean as filter keys) to translation keys
const BUILDING_TRANSLATION_KEYS: Record<string, string> = {
  "삼정타워": "building_samjung",
};
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check, Instagram, MapPin, Share2, ExternalLink, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

const langDots: { key: "en" | "ja" | "zh"; bg: string; label: string }[] = [
  { key: "en", bg: "bg-blue-500", label: "EN" },
  { key: "ja", bg: "bg-red-500", label: "JA" },
  { key: "zh", bg: "bg-yellow-500", label: "ZH" },
];

const paymentEmoji = { card: "💳", cash: "💵", kakao: "🟡", naver: "🟢" } as const;

export function ShopCard({ shop }: { shop: Shop }) {
  const { lang, t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const meta = CATEGORY_META[shop.category];
  const open = useMemo(() => isOpenNow(shop.hours), [shop.hours]);
  const name = shop.name[lang] ?? shop.name.ko;

  // Show localised address/hours when available
  const displayAddress =
    (lang !== "ko" && shop.addressEn) ? shop.addressEn : shop.address;
  const rawHours =
    (lang !== "ko" && shop.hoursEn) ? shop.hoursEn : shop.hours;
  const displayHours = localizeHours(rawHours, t, lang);
  const displayHoursNote = shop.hoursNote
    ? (shop.hoursNote[lang] ?? shop.hoursNote.ko)
    : undefined;
  const displayBuilding = shop.building
    ? (BUILDING_TRANSLATION_KEYS[shop.building]
        ? t(BUILDING_TRANSLATION_KEYS[shop.building])
        : shop.building)
    : undefined;

  const copy = async () => {
    await navigator.clipboard.writeText(shop.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: name, text: `${name}\n${shop.address}`, url: shop.naverMap }); } catch {}
    } else {
      copy();
    }
  };

  const statusColor =
    shop.status === "verified" ? "bg-success text-success-foreground"
    : shop.status === "partial" ? "bg-warning text-warning-foreground"
    : "bg-destructive text-destructive-foreground";

  const statusLabel =
    shop.status === "verified" ? `🟢 ${t("verified")}`
    : shop.status === "partial" ? `🟡 ${t("partial")}`
    : `🔴 ${t("unverified")}`;

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-card transition-smooth hover:scale-[1.02] hover:border-primary hover:shadow-glow">
      {/* representative photo */}
      {shop.image && !imgErr && (
        <div className="h-36 overflow-hidden">
          <img
            src={shop.image}
            alt={name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          />
        </div>
      )}

      {/* category strip */}
      <div className={`h-2 bg-${meta.color}`} style={{ backgroundColor: `hsl(var(--${meta.color}))` }} />

      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* header */}
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg leading-tight text-balance">{name}</h3>
              {shop.floor && (
                <Badge variant="outline" className="text-[10px] font-bold tracking-wider">
                  {shop.floor}
                </Badge>
              )}
            </div>
            {shop.englishName && lang !== "en" && (
              <p className="text-xs text-muted-foreground mt-0.5">{shop.englishName}</p>
            )}
            {displayBuilding && (
              <p className="text-xs text-primary font-semibold mt-1">🏢 {displayBuilding}</p>
            )}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap", statusColor)}>
                {statusLabel}
              </span>
            </TooltipTrigger>
            <TooltipContent>{statusLabel}</TooltipContent>
          </Tooltip>
        </header>

        {/* category + open */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold text-white"
            style={{ backgroundColor: `hsl(var(--${meta.color}))` }}
          >
            <span>{meta.emoji}</span>
            <span>{meta[lang as keyof typeof meta] as string ?? meta.en}</span>
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold",
              open === true && "bg-success/15 text-success",
              open === false && "bg-muted text-muted-foreground",
              open === null && "bg-warning/15 text-warning-foreground"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: open === true ? "hsl(var(--success))" : open === false ? "hsl(var(--muted-foreground))" : "hsl(var(--warning))" }}
            />
            {open === true ? `🟢 ${t("open_now")}` : open === false ? `🔴 ${t("closed")}` : `🟡 ${t("hours_unknown")}`}
          </span>
          {shop.taxFree && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-success/15 text-success font-bold">
              {t("tax_free")}
            </span>
          )}
        </div>

        {/* address + hours */}
        <div className="space-y-1.5 text-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="flex items-start gap-2 text-muted-foreground cursor-help">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                <span className="line-clamp-2">{displayAddress}</span>
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">{displayAddress}</TooltipContent>
          </Tooltip>
          <p className="text-xs text-muted-foreground pl-6">
            🕒 {displayHours} {displayHoursNote && <span className="text-primary">· {displayHoursNote}</span>}
          </p>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-1">
          {shop.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] font-medium">{tag}</Badge>
          ))}
          {shop.tags.length > 3 && (
            <Badge variant="outline" className="text-[10px]">+{shop.tags.length - 3}</Badge>
          )}
        </div>

        {/* payments + languages */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
          <div className="flex items-center gap-1 text-base">
            {shop.payments?.map((p) => (
              <Tooltip key={p}>
                <TooltipTrigger asChild>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                    {paymentEmoji[p]}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="capitalize">{p}</TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {langDots.map((d) => {
              const supported = shop.languages?.includes(d.key);
              return (
                <Tooltip key={d.key}>
                  <TooltipTrigger asChild>
                    <span
                      className={cn(
                        "inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold border",
                        supported ? `${d.bg} text-white border-transparent` : "bg-muted text-muted-foreground/40 border-border"
                      )}
                    >
                      {d.label}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{supported ? `Speaks ${d.label}` : `No ${d.label}`}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>

      {/* footer actions */}
      <footer className="grid grid-cols-2 gap-2 p-3 bg-muted/30 border-t border-border">
        <Button asChild size="sm" variant="default" className="text-xs h-9">
          <a href={shop.naverMap} target="_blank" rel="noopener noreferrer">
            <MapPin className="h-3.5 w-3.5 mr-1" /> {t("naver_map")}
          </a>
        </Button>
        {shop.kakaoMap && (
          <Button asChild size="sm" variant="outline" className="text-xs h-9">
            <a href={shop.kakaoMap} target="_blank" rel="noopener noreferrer">
              <MapPin className="h-3.5 w-3.5 mr-1" /> {t("kakao_map")}
            </a>
          </Button>
        )}
        {!shop.kakaoMap && (
          <Button asChild size="sm" variant="outline" className="text-xs h-9">
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(shop.address)}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1" /> Google
            </a>
          </Button>
        )}
        {shop.instagram && (
          <Button asChild size="sm" variant="secondary" className="text-xs h-9 col-span-2 sm:col-span-1">
            <a href={`https://instagram.com/${shop.instagram}`} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-3.5 w-3.5 mr-1" /> @{shop.instagram}
            </a>
          </Button>
        )}
        {shop.twitter && (
          <Button asChild size="sm" variant="outline" className="text-xs h-9">
            <a href={`https://x.com/${shop.twitter}`} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-3.5 w-3.5 mr-1" /> @{shop.twitter}
            </a>
          </Button>
        )}
        {shop.kakaoMap && (
          <Button asChild size="sm" variant="outline" className="text-xs h-9">
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(shop.address)}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1" /> Google
            </a>
          </Button>
        )}
        <Button onClick={copy} size="sm" variant="ghost" className="text-xs h-9">
          {copied ? <><Check className="h-3.5 w-3.5 mr-1" /> {t("copied")}</> : <><Copy className="h-3.5 w-3.5 mr-1" /> {t("copy")}</>}
        </Button>
        <Button onClick={share} size="sm" variant="ghost" className="text-xs h-9">
          <Share2 className="h-3.5 w-3.5 mr-1" /> {t("share")}
        </Button>
      </footer>
    </article>
  );
}
