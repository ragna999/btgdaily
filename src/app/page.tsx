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
    <div className="border-t-2 border-[var(--color-brand-black)] pt-1.5 mb-5">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-black)]">
        {title}
      </span>
    </div>
  );
}

export default async function HomePage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [featured, { articles: latest, total }, trending] = await Promise.all([
    getFeaturedArticles(6),
    getLatestArticlesPaged(page, PAGE_SIZE),
    page === 1 ? getTrendingArticles(5) : Promise.resolve([]),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Zone 1 — hero
  const mainHero = page === 1 ? (featured[0] ?? latest[0]) : null;
  const heroId = mainHero?.id ?? -1;

  // Zone 1 right — secondary stories beside hero
  const secondaryArticles =
    page === 1 ? featured.filter((a) => a.id !== heroId).slice(0, 2) : [];
  const secondaryIds = new Set(secondaryArticles.map((a) => a.id));

  // Zone 3 — Sorotan: remaining featured
  const sorotanArticles =
    page === 1
      ? featured
          .filter((a) => a.id !== heroId && !secondaryIds.has(a.id))
          .slice(0, 4)
      : [];
  const sorotanIds = new Set(sorotanArticles.map((a) => a.id));

  // Zone 4 — Latest grid
  const gridArticles = latest.filter(
    (a) => a.id !== heroId && !secondaryIds.has(a.id) && !sorotanIds.has(a.id)
  );

  const trendingCount = Math.min(trending.length, 5);
  const trendingGridCols =
    trendingCount >= 5
      ? "sm:grid-cols-5"
      : trendingCount === 4
      ? "sm:grid-cols-4"
      : trendingCount === 3
      ? "sm:grid-cols-3"
      : "sm:grid-cols-2";

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">

        {/* ── Zone 1: Hero + Secondary Stories ── */}
        {page === 1 && mainHero && (
          <section className="border-b border-[var(--color-border)] pb-8 mb-8">
            <SectionLabel title="Berita Utama" />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Hero — left */}
              <div
                className={[
                  secondaryArticles.length > 0
                    ? "lg:col-span-3 lg:pr-8 lg:border-r"
                    : "lg:col-span-5",
                  "pb-6 lg:pb-0 border-b lg:border-b-0 border-[var(--color-border)]",
                ].join(" ")}
              >
                <ArticleCard article={mainHero} variant="hero" />
              </div>

              {/* Secondary stories — right */}
              {secondaryArticles.length > 0 && (
                <div className="lg:col-span-2 lg:pl-8 pt-6 lg:pt-0 flex flex-col divide-y divide-[var(--color-border)]">
                  {secondaryArticles.map((article) => (
                    <div
                      key={article.id}
                      className="py-5 first:pt-0 last:pb-0"
                    >
                      <ArticleCard article={article} variant="mid" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Zone 2: Trending horizontal numbered strip ── */}
        {page === 1 && trending.length > 0 && (
          <section className="border-b border-[var(--color-border)] pb-8 mb-8">
            <SectionLabel title="Trending" />
            <div className={`grid grid-cols-1 ${trendingGridCols} gap-0`}>
              {trending.slice(0, 5).map((article, i) => (
                <div
                  key={article.id}
                  className={[
                    "flex items-start gap-3 py-4 sm:py-0",
                    i > 0
                      ? "border-t sm:border-t-0 sm:border-l border-[var(--color-border)] sm:pl-5 pt-4 sm:pt-0"
                      : "",
                    i < trendingCount - 1 ? "sm:pr-5" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span
                    className="text-3xl font-bold text-[var(--color-border)] leading-none select-none shrink-0 mt-0.5"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {i + 1}
                  </span>
                  <ArticleCard article={article} variant="compact" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Zone 3: Sorotan ── */}
        {page === 1 && sorotanArticles.length > 0 && (
          <section className="border-b border-[var(--color-border)] pb-8 mb-8">
            <SectionLabel title="Sorotan" />
            <div
              className={`grid grid-cols-1 gap-0 ${
                sorotanArticles.length >= 4
                  ? "md:grid-cols-4"
                  : sorotanArticles.length === 3
                  ? "md:grid-cols-3"
                  : "md:grid-cols-2"
              }`}
            >
              {sorotanArticles.map((article, i) => (
                <div
                  key={article.id}
                  className={[
                    "py-5 md:py-0",
                    i > 0
                      ? "border-t md:border-t-0 md:border-l border-[var(--color-border)] md:pl-5 pt-5 md:pt-0"
                      : "",
                    i < sorotanArticles.length - 1 ? "md:pr-5" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <ArticleCard article={article} variant="mid" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Zone 4: Latest grid ── */}
        {gridArticles.length > 0 ? (
          <section>
            <SectionLabel title="Berita Terbaru" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
              {gridArticles.map((article) => (
                <div
                  key={article.id}
                  className="border-b border-[var(--color-border)] py-5"
                >
                  <ArticleCard article={article} variant="newspaper" />
                </div>
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/"
            />
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
