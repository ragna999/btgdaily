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

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [featured, { articles: latest, total }, trending] = await Promise.all([
    getFeaturedArticles(4),
    getLatestArticlesPaged(page, PAGE_SIZE),
    page === 1 ? getTrendingArticles(5) : Promise.resolve([]),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Hero: top featured, or fall back to latest[0]
  const heroArticle = page === 1 ? (featured[0] ?? latest[0]) : null;
  const heroId = heroArticle?.id ?? -1;

  // Sorotan row: only from featured (non-hero), max 3
  const midArticles =
    page === 1 ? featured.filter((a) => a.id !== heroId).slice(0, 3) : [];

  // Grid: latest articles, excluding any that already appear in featured zones
  const usedIds = new Set(featured.map((a) => a.id));
  usedIds.add(heroId);
  const gridArticles = latest.filter((a) => !usedIds.has(a.id));

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">

        {/* ── Zone 1: Hero + Trending sidebar ── */}
        {page === 1 && heroArticle && (
          <section className="border-b border-[var(--color-border)] pb-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

              {/* Hero */}
              <div className="lg:col-span-8 lg:pr-8 lg:border-r lg:border-[var(--color-border)]">
                <ArticleCard article={heroArticle} variant="hero" />
              </div>

              {/* Trending sidebar */}
              {trending.length > 0 && (
                <div className="lg:col-span-4 lg:pl-8 mt-8 lg:mt-0 border-t lg:border-t-0 border-[var(--color-border)] pt-6 lg:pt-0">
                  <div className="border-t-4 border-[var(--color-brand-red)] pt-3 mb-1">
                    <h2 className="text-[11px] font-bold uppercase tracking-[0.15em]">
                      Trending
                    </h2>
                  </div>
                  <ol>
                    {trending.map((article, i) => (
                      <li
                        key={article.id}
                        className="flex gap-3 items-start py-3 border-b border-[var(--color-border)] last:border-0"
                      >
                        <span
                          className="text-2xl font-bold text-[var(--color-border)] leading-none shrink-0 w-5 mt-0.5 select-none"
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
          </section>
        )}

        {/* ── Zone 2: Sorotan (mid row, 3 cols with dividers) ── */}
        {page === 1 && midArticles.length > 0 && (
          <section className="border-b border-[var(--color-border)] pb-8 mb-8">
            <div className="border-t-4 border-[var(--color-brand-black)] pt-3 mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.15em]">
                Sorotan
              </h2>
            </div>
            <div
              className={`grid grid-cols-1 md:divide-x divide-[var(--color-border)] ${
                midArticles.length >= 3
                  ? "md:grid-cols-3"
                  : midArticles.length === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-1"
              }`}
            >
              {midArticles.map((article, i) => (
                <div
                  key={article.id}
                  className={`${
                    i === 0
                      ? "md:pr-6"
                      : i === midArticles.length - 1
                      ? "md:pl-6"
                      : "md:px-6"
                  } ${
                    i > 0
                      ? "pt-6 md:pt-0 border-t md:border-t-0 border-[var(--color-border)]"
                      : ""
                  }`}
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Zone 3: Latest grid ── */}
        {gridArticles.length > 0 ? (
          <section>
            <div className="border-t-4 border-[var(--color-brand-black)] pt-3 mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.15em]">
                Berita Terbaru
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
              {gridArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
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
