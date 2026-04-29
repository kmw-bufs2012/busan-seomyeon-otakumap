import { useI18n } from "@/i18n/I18nProvider";
import { LANGS, Lang } from "@/i18n/translations";
import { Instagram, Twitter } from "lucide-react";

export function Footer() {
  const { t, setLang } = useI18n();
  return (
    <footer className="mt-20 bg-[hsl(240_30%_8%)] text-white">
      <div className="container max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎌</span>
            <span className="font-extrabold text-lg">ANIBUS</span>
          </div>
          <p className="text-sm text-white/70 mb-4">{t("brand")}</p>
          <p className="text-xs text-white/40 text-center mb-4">
            © 2025 부산 서면 애니샵 맵. Made by RANA(sekkenkun123@gmail.com). All rights reserved.
          </p>
          <p className="text-xs text-white/50 leading-relaxed max-w-md">
            {t("footer_disclaimer")}
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://instagram.com/anibus_busan" target="_blank" rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-smooth">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://x.com/anibus_busan" target="_blank" rel="noopener noreferrer"
              className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-smooth">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="font-bold text-sm mb-3 uppercase tracking-wider text-white/90">Languages</p>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code as Lang)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-smooth"
              >
                {l.label}
              </button>
            ))}
          </div>

          <p className="font-bold text-sm mt-6 mb-2 uppercase tracking-wider text-white/90">Stats</p>
          <ul className="text-xs text-white/70 space-y-1">
            <li>23 {t("stats_shops")}</li>
            <li>2 {t("tab_cafes").replace(/^☕\s*/, "")}</li>
            <li>7 {t("stats_languages")}</li>
            <li>{t("stats_update")}</li>
          </ul>
        </div>

        <div>
          <p className="font-bold text-sm mb-3 uppercase tracking-wider text-white/90">Links</p>
          <ul className="text-sm text-white/70 space-y-2">
            <li><a className="hover:text-white transition-smooth" href="#">{t("footer_register")}</a></li>
            <li><a className="hover:text-white transition-smooth" href="#">{t("footer_partners")}</a></li>
            <li><a className="hover:text-white transition-smooth" href="#">{t("footer_privacy")}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © 2026 ANIBUS · Busan, South Korea
      </div>
    </footer>
  );
}
