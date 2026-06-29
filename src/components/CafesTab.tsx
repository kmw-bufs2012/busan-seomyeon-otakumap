import { useMemo, useState } from "react";
import { CAFES } from "@/data/shops";
import { useI18n } from "@/i18n/I18nProvider";
import { CafeCard } from "./CafeCard";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Filter = "all" | "maid" | "concafe" | "maidbar";

export function CafesTab() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t("filter_all") },
    { key: "maid", label: "🎀 메이드카페" },
    { key: "concafe", label: "🎭 콘셉트카페" },
    { key: "maidbar", label: "🍸 메이드 바" },
  ];

  const filtered = useMemo(() => CAFES.filter((c) => filter === "all" || c.category === filter), [filter]);

  return (
    <div>
      {/* Big warning banner */}
      <div className="container max-w-7xl mx-auto pt-6">
        <div className="rounded-lg border border-destructive/40 bg-destructive/8 px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive text-sm mb-1">{t("warning_cafe_title")}</p>
            <p className="text-sm text-foreground/80">{t("warning_cafe_price")}</p>
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
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-smooth border",
                filter === f.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
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
