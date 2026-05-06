import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/**
 * First-visit notice popup for the main page.
 *
 * Behavior:
 * - Opens automatically once on mount when the user has NOT dismissed the
 *   notice with "Don't show today" within the last 24 hours.
 * - Stores the dismissal timestamp in `localStorage` under
 *   `ANIBUS_NOTICE_DISMISSED_AT`. If the saved time is older than 24h, the
 *   popup is shown again on the next visit.
 * - Closing without checking the box does NOT save anything, so the popup
 *   re-appears on the next visit (per spec).
 *
 * Built on top of the shadcn/ui (Radix) Dialog primitive, which already
 * provides ESC key close, backdrop click close, focus trap, body scroll
 * lock, and the top-right "X" close button.
 */
const STORAGE_KEY = "ANIBUS_NOTICE_DISMISSED_AT";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const CONTACT_EMAIL = "sekkenkun123@gmail.com";

export function NoticePopup() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);

  // On first mount, decide whether to open.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const dismissedAt = Number(raw);
        if (Number.isFinite(dismissedAt) && Date.now() - dismissedAt < ONE_DAY_MS) {
          // Within 24h of last "don't show today" — keep closed.
          return;
        }
      }
    } catch {
      // localStorage unavailable (e.g. privacy mode) — fall through and show.
    }
    setOpen(true);
  }, []);

  // Persist the dismissal timestamp only when the user opted in.
  function handleClose() {
    if (dontShowToday) {
      try {
        window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        // ignore — we still close the dialog
      }
    }
    setOpen(false);
  }

  // Radix fires onOpenChange for ESC / backdrop / X — funnel through the same
  // logic so the checkbox state is honored regardless of close method.
  function handleOpenChange(next: boolean) {
    if (!next) {
      handleClose();
    } else {
      setOpen(true);
    }
  }

  // Split the body2 template at the {email} token so we can render mailto:.
  const body2 = t("notice_body2");
  const [body2Before, body2After] = body2.includes("{email}")
    ? body2.split("{email}")
    : [body2, ""];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold gradient-hero bg-clip-text text-transparent text-balance leading-snug">
            {t("notice_title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("notice_title")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-base leading-relaxed text-foreground">
          <p>{t("notice_body1")}</p>
          <p>
            {body2Before}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:underline"
            >
              {CONTACT_EMAIL}
            </a>
            {body2After}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="notice-dont-show-today"
            checked={dontShowToday}
            onCheckedChange={(v) => setDontShowToday(v === true)}
          />
          <Label
            htmlFor="notice-dont-show-today"
            className="text-sm text-muted-foreground cursor-pointer select-none"
          >
            {t("notice_dont_show_today")}
          </Label>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            onClick={handleClose}
            className="gradient-hero text-white font-semibold px-8"
          >
            {t("notice_close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
