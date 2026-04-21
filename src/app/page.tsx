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
    getFeaturedArticles(3),
    getLatestArticlesPaged(page, PAGE_SIZE),
    page === 1 ? getTrendingArticles(5) : Promise.resolve([]),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const heroArticle = page === 1 ? (featured[0] ?? latest[0]) : null;
  const sideArticles =
    page === 1
      ? featured.slice(1, 3).length >= 2
        ? featured.slice(1, 3)
        : latest.slice(1, 3)
      : [];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Hero section — only on page 1 */}
        {page === 1 && heroArticle && (
          <section className="border-b border-[var(--color-border)] pb-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 lg:border-r lg:border-[var(--color-border)] lg:pr-6">
                <ArticleCard article={heroArticle} variant="hero" />
              </div>

              <div className="flex flex-col">
                {sideArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="side" />
                ))}

                {trending.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <h2 className="text-xs font-bold uppercase tracking-widest mb-3">
                      Trending
                    </h2>
                    <ol className="space-y-0">
                      {trending.map((article, i) => (
                        <li
                          key={article.id}
                          className="flex gap-3 items-start py-2 border-b border-[var(--color-border)] last:border-0"
                        >
                          <span
                            className="text-2xl font-bold text-[var(--color-border)] leading-none shrink-0 w-5 mt-0.5"
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

        {/* Latest news grid */}
        {latest.length > 0 ? (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2
                className="text-lg font-bold whitespace-nowrap"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Berita Terbaru
              </h2>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
              {latest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} basePath="/" />
          </section>
        ) : (
          <div className="py-32 text-center text-[var(--color-muted)]">
            <p
              className="text-2xl font-medium"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Belum ada berita yang dipublikasikan.
            </p>
            <p className="mt-2 text-sm">Silakan tambahkan artikel melalui panel admin.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
