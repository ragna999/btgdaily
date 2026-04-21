import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import { getAuthorById, getArticlesByAuthorPaged } from "@/lib/queries";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const author = await getAuthorById(Number(id));
  if (!author) return {};
  return {
    title: author.name,
    description: author.bio ?? `Artikel-artikel oleh ${author.name} di Bantargebang Daily.`,
  };
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const authorId = Number(id);

  const [author, { articles, total }] = await Promise.all([
    getAuthorById(authorId),
    getArticlesByAuthorPaged(authorId, page, PAGE_SIZE),
  ]);

  if (!author) notFound();

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const basePath = `/penulis/${id}`;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Author card */}
        <div className="border-b-2 border-[var(--color-brand-black)] pb-6 mb-8">
          <div className="flex items-start gap-5">
            {author.avatar_url ? (
              <img
                src={author.avatar_url}
                alt={author.name}
                className="w-20 h-20 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <span
                  className="text-3xl font-bold text-gray-500"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {author.name[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">
                Jurnalis
              </p>
              <h1
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {author.name}
              </h1>
              {author.bio && (
                <p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed max-w-xl">
                  {author.bio}
                </p>
              )}
              <p className="text-xs text-[var(--color-muted)] mt-2">
                {total} artikel dipublikasikan
              </p>
            </div>
          </div>
        </div>

        {articles.length === 0 && (
          <div className="py-24 text-center text-[var(--color-muted)]">
            <p className="text-lg" style={{ fontFamily: "var(--font-serif)" }}>
              Belum ada artikel yang dipublikasikan.
            </p>
          </div>
        )}

        {articles.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
