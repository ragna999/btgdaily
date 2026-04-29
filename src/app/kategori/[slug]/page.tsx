import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import { getCategoryBySlug, getArticlesByCategoryPaged } from "@/lib/queries";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: `Kumpulan berita ${category.name} terbaru dari Bantargebang Times.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [category, { articles, total }] = await Promise.all([
    getCategoryBySlug(slug),
    getArticlesByCategoryPaged(slug, page, PAGE_SIZE),
  ]);

  if (!category) notFound();

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const heroArticle = page === 1 ? articles[0] : null;
  const gridArticles = page === 1 ? articles.slice(1) : articles;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="border-t-2 border-[var(--color-brand-black)] pt-1.5 mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">
            Kategori
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {category.name}
          </h1>
          {total > 0 && (
            <p className="text-sm text-[var(--color-muted)] mt-2 border-t border-[var(--color-border)] pt-2">
              {total} artikel
            </p>
          )}
        </div>

        {articles.length === 0 && (
          <div className="py-24 text-center text-[var(--color-muted)]">
            <p className="text-lg" style={{ fontFamily: "var(--font-serif)" }}>
              Belum ada artikel di kategori ini.
            </p>
          </div>
        )}

        {heroArticle && (
          <div className="border-b border-[var(--color-border)] pb-8 mb-8">
            <ArticleCard article={heroArticle} variant="hero" />
          </div>
        )}

        {gridArticles.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
              {gridArticles.map((article) => (
                <div key={article.id} className="border-b border-[var(--color-border)] py-5">
                  <ArticleCard article={article} variant="newspaper" />
                </div>
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/kategori/${slug}`}
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
