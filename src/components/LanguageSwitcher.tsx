import { useI18n } from "@/i18n/I18nProvider";
import { LANGS, Lang } from "@/i18n/translations";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={cn("inline-flex gap-1 rounded-full bg-card/80 backdrop-blur p-1 border border-border shadow-card", className)}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code as Lang)}
          className={cn(
            "px-3 py-1.5 text-xs font-bold rounded-full transition-smooth",
            lang === l.code
              ? "bg-primary text-primary-foreground shadow-glow"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={lang === l.code}
          aria-label={`Language: ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
