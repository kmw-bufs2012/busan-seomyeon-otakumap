import { createContext, useContext, useEffect, useState, ReactNode, createElement } from "react";
import { Lang, TRANSLATIONS } from "./translations";

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);
const STORAGE_KEY = "animap_lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ko";
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && TRANSLATIONS[saved]) return saved;
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith("ja")) return "ja";
    if (nav.startsWith("zh-tw") || nav.startsWith("zh-hk")) return "zh-tw";
    if (nav.startsWith("zh")) return "zh-cn";
    if (nav.startsWith("ko")) return "ko";
    if (nav.startsWith("vi")) return "vi";
    if (nav.startsWith("th")) return "th";
    return "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => TRANSLATIONS[lang][key] ?? TRANSLATIONS.ko[key] ?? key;

  return createElement(Ctx.Provider, { value: { lang, setLang: setLangState, t } }, children);
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
