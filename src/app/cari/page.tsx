import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { searchArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Hasil pencarian: ${q}` : "Pencarian",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const articles = query ? await searchArticles(query) : [];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="border-b-2 border-[var(--color-brand-black)] pb-3 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-muted)] mb-1">
            Pencarian
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {query ? `"${query}"` : "Cari Berita"}
          </h1>
          {query && (
            <p className="text-sm text-[var(--color-muted)] mt-1">
              {articles.length} hasil ditemukan
            </p>
          )}
        </div>

        {!query && (
          <div className="py-24 text-center text-[var(--color-muted)]">
            <p className="text-lg" style={{ fontFamily: "var(--font-serif)" }}>
              Masukkan kata kunci di kotak pencarian.
            </p>
          </div>
        )}

        {query && articles.length === 0 && (
          <div className="py-24 text-center text-[var(--color-muted)]">
            <p className="text-lg" style={{ fontFamily: "var(--font-serif)" }}>
              Tidak ada hasil untuk &ldquo;{query}&rdquo;.
            </p>
            <p className="text-sm mt-2">Coba kata kunci yang berbeda.</p>
          </div>
        )}

        {articles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
