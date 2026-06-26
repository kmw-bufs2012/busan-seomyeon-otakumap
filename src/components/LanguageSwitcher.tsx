import { Globe, Check } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { LANGS, Lang } from "@/i18n/translations";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <>
      {/* Mobile: compact dropdown so 7 languages don't overflow the top bar */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-card/80 backdrop-blur px-3 py-1.5 text-xs font-bold border border-border shadow-card text-foreground transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden",
            className
          )}
          aria-label="Change language"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{current.label}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[8rem]">
          {LANGS.map((l) => (
            <DropdownMenuItem
              key={l.code}
              onSelect={() => setLang(l.code as Lang)}
              className="cursor-pointer text-sm font-semibold"
            >
              <span className="flex-1">{l.label}</span>
              {lang === l.code && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Desktop: inline pill row */}
      <div
        className={cn(
          "hidden md:inline-flex gap-1 rounded-full bg-card/80 backdrop-blur p-1 border border-border shadow-card",
          className
        )}
      >
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
    </>
  );
}
