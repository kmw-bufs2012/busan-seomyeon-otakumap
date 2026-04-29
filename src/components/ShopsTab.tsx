import { useMemo, useState } from "react";
import { SHOPS, CATEGORY_META, ROUTES } from "@/data/shops";
import { Category } from "@/data/types";
import { useI18n } from "@/i18n/I18nProvider";
import { isOpenNow } from "@/lib/openNow";
import { ShopCard } from "./ShopCard";
import { RouteCard } from "./RouteCard";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterKey = "all" | "samjung" | "open" | "taxfree" | Category;

export function ShopsTab() {
  const { lang, t } = useI18n();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("filter_all") },
    { key: "samjung", label: `🏢 ${t("building_samjung")}` },
    { key: "anime", label: CATEGORY_META.anime[lang as "ko"] },
    { key: "figure", label: CATEGORY_META.figure[lang as "ko"] },
    { key: "gacha", label: CATEGORY_META.gacha[lang as "ko"] },
    { key: "arttoy", label: CATEGORY_META.arttoy[lang as "ko"] },
    { key: "cafecollab", label: CATEGORY_META.cafecollab[lang as "ko"] },
    { key: "open", label: `🟢 ${t("filter_open")}` },
    { key: "taxfree", label: `★ ${t("filter_taxfree")}` },
  ];

  const filtered = useMemo(() => {
    return SHOPS.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        const matches = [s.name.ko, s.name.en, s.englishName, s.address]
          .filter(Boolean).some((v) => v!.toLowerCase().includes(q));
        if (!matches) return false;
      }
      switch (filter) {
        case "all": return true;
        case "samjung": return s.building === "삼정타워";
        case "open": return isOpenNow(s.hours) === true;
        case "taxfree": return !!s.taxFree;
        default: return s.category === filter;
      }
    });
  }, [filter, search]);

  return (
    <div>
      {/* sticky filter bar */}
      <div className="sticky top-[64px] z-30 -mx-4 px-4 py-3 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_placeholder")}
              className="pl-9 bg-card border-border"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-2 px-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-smooth border",
                  filter === f.key
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("showing")} <span className="font-bold text-foreground">{filtered.length}</span> {t("of")} {SHOPS.length}
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">{t("no_results")}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {filtered.map((s) => <ShopCard key={s.id} shop={s} />)}
          </div>
        )}

        {/* Routes */}
        <section className="mt-16">
          <header className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-extrabold">{t("tab_routes")}</h2>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROUTES.map((r) => <RouteCard key={r.id} route={r} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
