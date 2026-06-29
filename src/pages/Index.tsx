import { useI18n } from "@/i18n/I18nProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MapButton } from "@/components/MapButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollToTop } from "@/components/ScrollToTop";
import { NoticePopup } from "@/components/NoticePopup";
import { ShopsTab } from "@/components/ShopsTab";
import { CafesTab } from "@/components/CafesTab";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SHOPS, CAFES } from "@/data/shops";

const Index = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Copyright notice */}
      <div className="bg-foreground text-background text-center text-[11px] py-2 px-4 font-medium tracking-wide">
        📷 모든 장소의 사진은 해당 사업주에게 소유권이 있습니다. All photos are property of their respective business owners.
      </div>

      {/* Sticky top bar */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="container max-w-7xl mx-auto h-16 px-4 flex items-center justify-between gap-3">
          <a href="#" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="text-2xl">🎌</span>
            <span className="hidden sm:inline">ANIBUS</span>
            <span className="text-xs text-muted-foreground hidden md:inline">· {t("brand_subtitle")}</span>
          </a>
          <div className="flex items-center gap-2">
            <MapButton />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        <img
          src="/images/banner-main.png"
          alt="서면 애니메이션 거리 - 덕후의 성지"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Single dark overlay for legibility — no purple/pink gradient covering stats */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,10,8,0.55) 0%, rgba(12,10,8,0.82) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative container max-w-7xl mx-auto px-4 py-14 sm:py-20 md:py-28 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
              Busan · Seomyeon · 釜山
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] text-balance break-keep mb-5">
              {t("hero_title")}
            </h1>
            <p className="text-base md:text-lg text-white/75 max-w-2xl break-keep leading-relaxed">
              {t("hero_sub")}
            </p>

            {/* Stats — solid white text on subtle dark glass, no gradient overlay */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-3 mt-8 sm:mt-10 max-w-4xl">
              {[
                { n: SHOPS.length, l: t("stats_shops") },
                { n: CAFES.length, l: t("stats_cafes") },
                { n: 7, l: t("stats_languages") },
                { n: "🏙", l: t("stats_area") },
                { n: "🔄", l: t("stats_update") },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white/8 backdrop-blur border border-white/12 px-4 py-3"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">{s.n}</div>
                  <div className="text-[11px] text-white/70 mt-1 font-medium uppercase tracking-wider">{s.l}</div>
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
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto bg-muted rounded-lg p-1">
                <TabsTrigger value="shops" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-card font-semibold rounded-md">
                  {t("tab_shops")}
                </TabsTrigger>
                <TabsTrigger value="cafes" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-card font-semibold rounded-md">
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
      <NoticePopup />
    </div>
  );
};

export default Index;
