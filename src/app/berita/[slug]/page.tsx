import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import ViewTracker from "@/components/ViewTracker";
import ShareButtons from "@/components/ShareButtons";
import { getArticleBySlug, getRelatedArticles } from "@/lib/queries";
import { formatDate, estimateReadTime } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.published_at,
      authors: article.author ? [article.author.name] : [],
      images: article.thumbnail_url
        ? [{ url: article.thumbnail_url, width: 1200, height: 630, alt: article.title }]
        : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article.id, article.category_id, 4);
  const readTime = estimateReadTime(article.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.thumbnail_url ? [article.thumbnail_url] : [],
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: article.author
      ? [{ "@type": "Person", name: article.author.name }]
      : [],
    publisher: { "@type": "Organization", name: "Bantargebang Times" },
  };

  return (
    <>
      <Header />
      <ViewTracker articleId={article.id} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article body */}
          <article className="lg:col-span-2">
            <nav className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-4">
              <Link href="/" className="hover:text-[var(--color-brand-black)]">
                Beranda
              </Link>
              {article.category && (
                <>
                  <span>/</span>
                  <Link
                    href={`/kategori/${article.category.slug}`}
                    className="hover:text-[var(--color-brand-black)]"
                  >
                    {article.category.name}
                  </Link>
                </>
              )}
            </nav>

            {article.category && (
              <Link
                href={`/kategori/${article.category.slug}`}
                className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-red)] hover:underline mb-2"
              >
                {article.category.name}
              </Link>
            )}

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {article.title}
            </h1>

            <div className="pb-5 border-b border-[var(--color-border)] mb-6 space-y-1">
              {article.author && (
                <p className="text-sm">
                  <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-[0.12em] mr-1.5">
                    Oleh
                  </span>
                  <span className="font-semibold">{article.author.name}</span>
                </p>
              )}
              <p className="text-xs text-[var(--color-muted)]">
                <time dateTime={article.published_at}>
                  {formatDate(article.published_at)}
                </time>
                {" · "}
                {readTime} menit baca
                {" · "}
                {article.article_metrics?.views ?? 0} tayangan
              </p>
            </div>

            {article.thumbnail_url && (
              <div className="relative aspect-[16/9] w-full mb-6 overflow-hidden">
                <Image
                  src={article.thumbnail_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div
              className="prose-article"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {article.tags && article.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs border border-[var(--color-border)] px-3 py-1 text-[var(--color-muted)]"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <ShareButtons title={article.title} />

            {article.author && (
              <div className="mt-10 pt-6 border-t border-[var(--color-border)]">
                <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-widest mb-3">
                  Ditulis oleh
                </p>
                <div className="flex items-center gap-4">
                  <Link href={`/penulis/${article.author.id}`} className="shrink-0">
                    {article.author.avatar_url ? (
                      <img
                        src={article.author.avatar_url}
                        alt={article.author.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--color-border)] hover:ring-[var(--color-brand-black)] transition-all"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[var(--color-subtle)] ring-2 ring-[var(--color-border)] flex items-center justify-center">
                        <span className="text-lg font-bold text-[var(--color-muted)]" style={{ fontFamily: "var(--font-serif)" }}>
                          {article.author.name[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </Link>
                  <Link
                    href={`/penulis/${article.author.id}`}
                    className="font-bold text-base hover:text-[var(--color-brand-red)] transition-colors"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {article.author.name}
                  </Link>
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          {related.length > 0 && (
            <aside className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="border-t-2 border-[var(--color-brand-black)] pt-1.5 mb-5">
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    Berita Terkait
                  </h2>
                </div>
                <div className="space-y-0">
                  {related.map((rel) => (
                    <ArticleCard key={rel.id} article={rel} variant="side" />
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Footer />
    </>
  );
}
