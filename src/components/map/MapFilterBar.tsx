import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

export type MapFilter = "all" | "anime" | "figure" | "gacha" | "other";

interface MapFilterBarProps {
  value: MapFilter;
  onChange: (value: MapFilter) => void;
  counts: Record<MapFilter, number>;
}

export function MapFilterBar({ value, onChange, counts }: MapFilterBarProps) {
  const { t } = useI18n();

  const items: { key: MapFilter; label: string; dot: string }[] = [
    { key: "all",    label: t("map_filter_all"),    dot: "bg-muted-foreground" },
    { key: "anime",  label: t("map_filter_goods"),  dot: "bg-pink-500" },
    { key: "figure", label: t("map_filter_figure"), dot: "bg-purple-500" },
    { key: "gacha",  label: t("map_filter_gacha"),  dot: "bg-yellow-400" },
    { key: "other",  label: t("map_filter_other"),  dot: "bg-sky-400" },
  ];

  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="group"
      aria-label={t("map_filter_all")}
    >
      {items.map((item) => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-smooth",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              active
                ? "bg-primary text-primary-foreground border-primary shadow-card"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
            )}
            aria-pressed={active}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", item.dot)} aria-hidden="true" />
            <span>{item.label}</span>
            <span className="opacity-60">{counts[item.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
