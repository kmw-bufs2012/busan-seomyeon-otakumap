import { useI18n } from "@/i18n/I18nProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ShopsTab } from "@/components/ShopsTab";
import { CafesTab } from "@/components/CafesTab";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SHOPS, CAFES } from "@/data/shops";

const Index = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Copyright notice */}
      <div className="bg-red-600 text-white text-center text-xs py-2 px-4 font-semibold">
        📷 모든 장소의 사진은 해당 사업주에게 소유권이 있습니다. All photos are property of their respective business owners.
      </div>

      {/* Sticky top bar */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto h-16 px-4 flex items-center justify-between gap-3">
          <a href="#" className="flex items-center gap-2 font-extrabold">
            <span className="text-2xl">🎌</span>
            <span className="hidden sm:inline">ANIBUS</span>
            <span className="text-xs text-muted-foreground hidden md:inline">· 부산 애니맵</span>
          </a>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        <img
          src="/images/seomyeon-otaku-street.jpg"
          alt="서면 애니메이션 거리 - 덕후의 성지"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Single dark overlay for legibility — no purple/pink gradient covering stats */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(5,0,20,0.85) 0%, rgba(5,0,20,0.55) 55%, rgba(5,0,20,0.35) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative container max-w-7xl mx-auto px-4 py-20 md:py-28 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
              Busan · Seomyeon · 釜山
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-balance mb-5 whitespace-nowrap">
              {t("hero_title")}
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl break-keep leading-relaxed">
              {t("hero_sub")}
            </p>

            {/* Stats — solid white text on subtle dark glass, no gradient overlay */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 max-w-3xl">
              {[
                { n: SHOPS.length, l: t("stats_shops") },
                { n: 7, l: t("stats_languages") },
                { n: "🏙", l: t("stats_area") },
                { n: "🔄", l: t("stats_update") },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-black/40 backdrop-blur border border-white/15 px-4 py-3"
                >
                  <div className="text-2xl md:text-3xl font-extrabold text-white">{s.n}</div>
                  <div className="text-xs text-white mt-1 font-medium">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <main>
        <Tabs defaultValue="shops" className="w-full">
          <div className="sticky top-16 z-30 bg-background/85 backdrop-blur-xl border-b border-border">
            <div className="container max-w-7xl mx-auto px-4 py-3">
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-muted">
                <TabsTrigger value="shops" className="data-[state=active]:gradient-hero data-[state=active]:text-white font-bold">
                  {t("tab_shops")}
                </TabsTrigger>
                <TabsTrigger value="cafes" className="data-[state=active]:gradient-cafe data-[state=active]:text-white font-bold">
                  {t("tab_cafes")} ({CAFES.length})
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          <TabsContent value="shops" className="mt-0">
            <ShopsTab />
          </TabsContent>
          <TabsContent value="cafes" className="mt-0">
            <CafesTab />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
