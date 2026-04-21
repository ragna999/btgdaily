import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/lib/types";

interface Props {
  article: Article;
  variant?: "default" | "hero" | "compact" | "side";
}

export default function ArticleCard({ article, variant = "default" }: Props) {
  const category = article.category;
  const author = article.author;

  if (variant === "hero") {
    return (
      <article className="group">
        {article.thumbnail_url && (
          <Link href={`/berita/${article.slug}`} className="block overflow-hidden mb-3">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                priority
              />
            </div>
          </Link>
        )}
        {category && (
          <Link
            href={`/kategori/${category.slug}`}
            className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-red)] hover:underline"
          >
            {category.name}
          </Link>
        )}
        <Link href={`/berita/${article.slug}`}>
          <h2
            className="text-2xl md:text-3xl font-bold leading-tight mt-1 mb-2 group-hover:text-[var(--color-brand-red)] transition-colors"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {article.title}
          </h2>
        </Link>
        {article.excerpt && (
          <p className="text-[var(--color-muted)] text-sm leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-muted)]">
          {author && <span>{author.name}</span>}
          {author && <span>·</span>}
          <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
        </div>
      </article>
    );
  }

  if (variant === "side") {
    return (
      <article className="group flex gap-3 py-3 border-b border-[var(--color-border)] last:border-0">
        {article.thumbnail_url && (
          <Link href={`/berita/${article.slug}`} className="shrink-0">
            <div className="relative w-20 h-16 overflow-hidden">
              <Image
                src={article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-[1.05] transition-transform duration-300"
              />
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-red)]">
              {category.name}
            </span>
          )}
          <Link href={`/berita/${article.slug}`}>
            <h3
              className="text-sm font-bold leading-snug mt-0.5 group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {article.title}
            </h3>
          </Link>
          <time className="text-[10px] text-[var(--color-muted)]" dateTime={article.published_at}>
            {formatDate(article.published_at)}
          </time>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group py-3 border-b border-[var(--color-border)] last:border-0">
        {category && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-red)]">
            {category.name}
          </span>
        )}
        <Link href={`/berita/${article.slug}`}>
          <h3
            className="text-sm font-bold leading-snug mt-0.5 group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {article.title}
          </h3>
        </Link>
        <time className="text-[10px] text-[var(--color-muted)]" dateTime={article.published_at}>
          {formatDate(article.published_at)}
        </time>
      </article>
    );
  }

  // default card
  return (
    <article className="group">
      {article.thumbnail_url && (
        <Link href={`/berita/${article.slug}`} className="block overflow-hidden mb-2">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            />
          </div>
        </Link>
      )}
      {category && (
        <Link
          href={`/kategori/${category.slug}`}
          className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-red)] hover:underline"
        >
          {category.name}
        </Link>
      )}
      <Link href={`/berita/${article.slug}`}>
        <h3
          className="text-base font-bold leading-snug mt-0.5 mb-1 group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {article.title}
        </h3>
      </Link>
      {article.excerpt && (
        <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
      )}
      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[var(--color-muted)]">
        {author && <span>{author.name}</span>}
        {author && <span>·</span>}
        <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
      </div>
    </article>
  );
}
