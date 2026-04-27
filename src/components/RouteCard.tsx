import { useState } from "react";
import { Route } from "@/data/types";
import { SHOPS } from "@/data/shops";
import { useI18n } from "@/i18n/I18nProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Clock, Wallet, Gauge, ArrowRight } from "lucide-react";

export function RouteCard({ route }: { route: Route }) {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const title = route.title[lang] ?? route.title.ko;
  const fmtKRW = (n: number) => `₩${(n / 1000).toFixed(0)}k`;
  const isEmpty = route.stops.length === 0;

  return (
    <article className="rounded-2xl overflow-hidden border border-border bg-card shadow-card transition-smooth hover:scale-[1.01] hover:shadow-glow flex flex-col">
      <div className={`bg-gradient-to-br ${route.colorClass} px-5 py-4 text-white`}>
        <div className="text-3xl mb-1">{route.emoji}</div>
        <h3 className="font-extrabold text-lg text-balance leading-tight">{title}</h3>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center min-h-32 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground leading-relaxed break-keep">
              코스 정보를 준비 중입니다.
              <br />
              (Course details coming soon.)
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {route.stops.map((id, i) => {
                const shop = SHOPS.find((s) => s.id === id);
                const name = shop ? (shop.name[lang] ?? shop.name.ko) : id;
                return (
                  <span key={id} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-muted">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold">{i + 1}</span>
                    {name}
                  </span>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <Badge variant="secondary" className="justify-center py-1.5"><Clock className="h-3 w-3 mr-1" />{route.durationHours}h</Badge>
              <Badge variant="secondary" className="justify-center py-1.5"><Wallet className="h-3 w-3 mr-1" />{fmtKRW(route.budgetMin)}–{fmtKRW(route.budgetMax)}</Badge>
              <Badge variant="secondary" className="justify-center py-1.5"><Gauge className="h-3 w-3 mr-1" />{route.difficulty === "beginner" ? "★" : "★★"}</Badge>
            </div>
          </>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="mt-auto gradient-hero text-white border-0 disabled:opacity-50"
              disabled={isEmpty}
            >
              {t("view_route")} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{route.emoji} {title}</DialogTitle>
              <DialogDescription>
                <span className="inline-flex gap-3 mt-2 text-xs">
                  <span>🕒 {route.durationHours}h</span>
                  <span>💰 {fmtKRW(route.budgetMin)}–{fmtKRW(route.budgetMax)}</span>
                </span>
              </DialogDescription>
            </DialogHeader>
            <ol className="space-y-3 mt-2">
              {route.stops.map((id, i) => {
                const shop = SHOPS.find((s) => s.id === id);
                if (!shop) return null;
                return (
                  <li key={id} className="flex gap-3 items-start p-3 rounded-xl border border-border bg-muted/30">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full gradient-hero text-white font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{shop.name[lang] ?? shop.name.ko}</p>
                      <p className="text-xs text-muted-foreground">{shop.address}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">🕒 {shop.hours}</p>
                    </div>
                    <a href={shop.naverMap} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-semibold whitespace-nowrap">
                      🗺
                    </a>
                  </li>
                );
              })}
            </ol>
          </DialogContent>
        </Dialog>
      </div>
    </article>
  );
}
