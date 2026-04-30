import { Link } from "react-router-dom";
import { Map } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/**
 * Top-bar button placed to the LEFT of the LanguageSwitcher.
 * Navigates to the dedicated /map page (NAVER Cloud Platform Maps).
 */
export function MapButton({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <Link
      to="/map"
      aria-label={t("map_button")}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full",
        "bg-card/80 backdrop-blur border border-border shadow-card",
        "text-muted-foreground hover:text-foreground transition-smooth",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
    >
      <Map className="h-3.5 w-3.5" />
      <span>{t("map_button")}</span>
    </Link>
  );
}
