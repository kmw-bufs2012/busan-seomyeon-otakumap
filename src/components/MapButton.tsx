import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Map } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button placed to the LEFT of the LanguageSwitcher in the top bar.
 * Clicking it opens a small popup that says "Map is coming soon."
 * in the user's currently selected language (one of 7 supported).
 */
export function MapButton({ className }: { className?: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("map_button")}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full",
          "bg-card/80 backdrop-blur border border-border shadow-card",
          "text-muted-foreground hover:text-foreground transition-smooth",
          className
        )}
      >
        <Map className="h-3.5 w-3.5" />
        <span>{t("map_button")}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              {t("map_button")}
            </DialogTitle>
            <DialogDescription className="pt-2 text-base text-foreground">
              {t("map_coming_soon")}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
