import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import {
  getFeaturedArticles,
  getLatestArticlesPaged,
  getTrendingArticles,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type Props = { searchParams: Promise<{ page?: string }> };

function SectionLabel({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 border-t-2 border-[var(--color-brand-black)] pt-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap shrink-0">
        {title}
      </span>
      <div className="flex-1 border-b border-[var(--color-border)]" />
    </div>
  );
}

export default async function HomePage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [featured, { articles: latest, total }, trending] = await Promise.all([
    getFeaturedArticles(4),
    getLatestArticlesPaged(page, PAGE_SIZE),
    page === 1 ? getTrendingArticles(5) : Promise.resolve([]),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Zone 1 — hero (left) + sidebar articles (right)
  const mainHero = page === 1 ? (featured[0] ?? latest[0]) : null;
  const heroId = mainHero?.id ?? -1;
  const trendingIds = new Set(trending.map((a) => a.id));

  // Sidebar: up to 4 articles stacked beside the hero
  // prefer featured (non-hero), then latest — exclude trending to avoid overlap
  const sidebarArticles =
    page === 1
      ? [
          ...featured.filter((a) => a.id !== heroId),
          ...latest.filter(
            (a) =>
              a.id !== heroId &&
              !trendingIds.has(a.id) &&
              !featured.some((f) => f.id === a.id)
          ),
        ].slice(0, 4)
      : [];

  // Zone 2 — 4-col equal row below the hero block
  const usedZone1 = new Set([heroId, ...sidebarArticles.map((a) => a.id)]);
  const zone2Articles =
    page === 1
      ? latest
          .filter((a) => !usedZone1.has(a.id) && !trendingIds.has(a.id))
          .slice(0, 4)
      : [];

  // Zone 3 — dense latest grid
  const usedAll = new Set([...usedZone1, ...zone2Articles.map((a) => a.id)]);
  const gridArticles = latest.filter((a) => !usedAll.has(a.id));

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">

        {/* ── Zone 1: Hero (left 4 cols) + Sidebar (right 2 cols) ── */}
        {page === 1 && mainHero && (
          <section className="border-b border-[var(--color-border)] pb-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-0">

              {/* Hero */}
              <div className="lg:col-span-4 lg:pr-8 lg:border-r border-[var(--color-border)] pb-6 lg:pb-0 border-b lg:border-b-0">
                <ArticleCard article={mainHero} variant="hero" />
              </div>

              {/* Sidebar — stacked articles */}
              <div className="lg:col-span-2 lg:pl-6 pt-6 lg:pt-0">
                <SectionLabel title="Berita Pilihan" />
                <div>
                  {sidebarArticles.map((article) => (
                    <div
                      key={article.id}
                      className="py-3 border-b border-[var(--color-border)] last:border-0"
                    >
                      <ArticleCard article={article} variant="newspaper" />
                    </div>
                  ))}
                </div>

                {/* Trending below sidebar articles */}
                {trending.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-[var(--color-border)]">
                    <SectionLabel title="Trending" />
                    <ol>
                      {trending.slice(0, 4).map((article, i) => (
                        <li
                          key={article.id}
                          className="flex gap-2.5 py-2.5 border-b border-[var(--color-border)] last:border-0"
                        >
                          <span
                            className="text-lg font-bold text-[var(--color-border)] leading-none shrink-0 w-4 mt-0.5 select-none"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            {i + 1}
                          </span>
                          <ArticleCard article={article} variant="compact" />
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Zone 2: 4-col equal story row ── */}
        {page === 1 && zone2Articles.length > 0 && (
          <section className="border-b border-[var(--color-border)] pb-8 mb-8">
            <SectionLabel title="Sorotan" />
            <div
              className={`grid grid-cols-1 ${
                zone2Articles.length >= 4
                  ? "md:grid-cols-4"
                  : zone2Articles.length === 3
                  ? "md:grid-cols-3"
                  : "md:grid-cols-2"
              }`}
            >
              {zone2Articles.map((article, i) => (
                <div
                  key={article.id}
                  className={[
                    i === 0 ? "md:pr-5" : i === zone2Articles.length - 1 ? "md:pl-5" : "md:px-5",
                    i > 0 ? "md:border-l border-t md:border-t-0 border-[var(--color-border)] pt-5 md:pt-0" : "",
                  ].join(" ")}
                >
                  <ArticleCard article={article} variant="newspaper" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Zone 3: Dense latest grid ── */}
        {gridArticles.length > 0 ? (
          <section>
            <SectionLabel title="Berita Terbaru" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
              {gridArticles.map((article) => (
                <div
                  key={article.id}
                  className="border-b border-[var(--color-border)] py-4"
                >
                  <ArticleCard article={article} variant="newspaper" />
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} basePath="/" />
          </section>
        ) : (
          latest.length === 0 && (
            <div className="py-32 text-center text-[var(--color-muted)]">
              <p
                className="text-2xl font-medium"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Belum ada berita yang dipublikasikan.
              </p>
              <p className="mt-2 text-sm">
                Silakan tambahkan artikel melalui panel admin.
              </p>
            </div>
          )
        )}
      </main>
      <Footer />
    </>
  );
}
