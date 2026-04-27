import { useMemo, useState } from "react";
import { CAFES } from "@/data/shops";
import { useI18n } from "@/i18n/I18nProvider";
import { CafeCard } from "./CafeCard";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Filter = "all" | "maid";

export function CafesTab() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t("filter_all") },
    { key: "maid", label: "🎀 메이드카페" },
  ];

  const filtered = useMemo(() => CAFES.filter((c) => filter === "all" || c.category === filter), [filter]);

  return (
    <div>
      {/* Big warning banner */}
      <div className="container max-w-7xl mx-auto pt-6">
        <div className="rounded-2xl border-2 border-warning bg-warning/10 px-5 py-4 flex items-start gap-3 animate-pulse-glow">
          <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-destructive text-base mb-1">{t("warning_cafe_title")}</p>
            <p className="text-sm font-semibold text-foreground/90">{t("warning_cafe_price")}</p>
          </div>
        </div>
      </div>

      {/* filters */}
      <div className="container max-w-7xl mx-auto py-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-smooth border",
                filter === f.key
                  ? "bg-secondary text-secondary-foreground border-secondary shadow-glow"
                  : "bg-card text-muted-foreground border-border hover:border-secondary"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container max-w-7xl mx-auto pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {filtered.map((c) => <CafeCard key={c.id} cafe={c} />)}
        </div>
      </div>
    </div>
  );
}
