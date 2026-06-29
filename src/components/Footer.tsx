import { useI18n } from "@/i18n/I18nProvider";
import { LANGS, Lang } from "@/i18n/translations";
import { SHOPS, CAFES } from "@/data/shops";
import { Instagram, Twitter } from "lucide-react";

export function Footer() {
  const { t, setLang } = useI18n();
  return (
    <footer className="mt-20 bg-foreground text-background">
      <div className="container max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎌</span>
            <span className="font-bold text-lg">ANIBUS</span>
          </div>
          <p className="text-sm text-background/70 mb-4">{t("brand")}</p>
          <p className="text-xs text-background/55 text-center mb-4">
            © 2026 ANIBUS Made by RANA(sekkenkun123@gmail.com). All rights reserved.
          </p>
          <p className="text-xs text-background/60 leading-relaxed max-w-md whitespace-pre-line">
            {t("footer_disclaimer")}
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://instagram.com/anibus_busan" target="_blank" rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-smooth">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://x.com/anibus_busan" target="_blank" rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-smooth">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="font-semibold text-[11px] mb-3 uppercase tracking-[0.16em] text-background/70">Languages</p>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code as Lang)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-background/10 hover:bg-background/20 text-background transition-smooth"
              >
                {l.label}
              </button>
            ))}
          </div>

          <p className="font-semibold text-[11px] mt-6 mb-2 uppercase tracking-[0.16em] text-background/70">Stats</p>
          <ul className="text-xs text-background/70 space-y-1">
            <li>{SHOPS.length} {t("stats_shops")}</li>
            <li>{CAFES.length} {t("tab_cafes").replace(/^☕\s*/, "")}</li>
            <li>7 {t("stats_languages")}</li>
            <li>{t("stats_update")}</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-[11px] mb-3 uppercase tracking-[0.16em] text-background/70">Links</p>
          <ul className="text-sm text-background/70 space-y-2">
            <li><a className="hover:text-background transition-smooth" href="#">{t("footer_register")}</a></li>
            <li><a className="hover:text-background transition-smooth" href="#">{t("footer_partners")}</a></li>
            <li><a className="hover:text-background transition-smooth" href="#">{t("footer_privacy")}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10 py-4 text-center text-xs text-background/55">
        © 2026 ANIBUS. Made by RANA(sekkenkun123@gmail.com). All rights reserved.
      </div>
    </footer>
  );
}
