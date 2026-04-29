import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/lib/types";

interface Props {
  article: Article;
  variant?: "default" | "hero" | "compact" | "side" | "mid" | "newspaper";
}

export default function ArticleCard({ article, variant = "default" }: Props) {
  const category = article.category;
  const author = article.author;

  if (variant === "hero") {
    return (
      <article className="group">
        {article.thumbnail_url && (
          <Link href={`/berita/${article.slug}`} className="block overflow-hidden mb-5">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-[1.015] transition-transform duration-700"
                priority
              />
            </div>
          </Link>
        )}
        {category && (
          <Link
            href={`/kategori/${category.slug}`}
            className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-brand-red)] hover:underline"
          >
            {category.name}
          </Link>
        )}
        <Link href={`/berita/${article.slug}`}>
          <h2
            className="text-3xl md:text-4xl font-bold leading-tight mt-2 mb-3 group-hover:underline decoration-1 underline-offset-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {article.title}
          </h2>
        </Link>
        {article.excerpt && (
          <p className="text-[var(--color-muted)] text-[15px] leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
          {author && (
            <span className="font-semibold text-[var(--color-brand-black)]">
              {author.name}
            </span>
          )}
          {author && <span>·</span>}
          <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
        </div>
      </article>
    );
  }

  if (variant === "newspaper") {
    return (
      <article className="group">
        {article.thumbnail_url && (
          <Link href={`/berita/${article.slug}`} className="block overflow-hidden mb-2">
            <div className="relative h-36 w-full bg-[var(--color-subtle)]">
              <Image
                src={article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>
        )}
        {category && (
          <Link href={`/kategori/${category.slug}`}>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-brand-red)]">
              {category.name}
            </span>
          </Link>
        )}
        <Link href={`/berita/${article.slug}`}>
          <h3
            className="font-bold leading-tight mt-0.5 mb-1.5 group-hover:underline decoration-1 underline-offset-2 line-clamp-3"
            style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}
          >
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className="text-[13px] text-[var(--color-muted)] leading-snug line-clamp-2 mb-1.5">
            {article.excerpt}
          </p>
        )}
        <p className="text-[10px] text-[var(--color-muted)]">
          {author && (
            <span className="font-semibold text-[var(--color-brand-black)]">
              {author.name}
            </span>
          )}
          {author && " · "}
          <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
        </p>
      </article>
    );
  }

  if (variant === "mid") {
    return (
      <article className="group flex flex-col">
        {article.thumbnail_url && (
          <Link href={`/berita/${article.slug}`} className="block overflow-hidden mb-3">
            <div className="relative h-44 w-full bg-[var(--color-subtle)]">
              <Image
                src={article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </Link>
        )}
        {category && (
          <Link
            href={`/kategori/${category.slug}`}
            className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-brand-red)] hover:underline"
          >
            {category.name}
          </Link>
        )}
        <Link href={`/berita/${article.slug}`} className="flex-1">
          <h3
            className="text-lg font-bold leading-snug mt-1.5 mb-2 group-hover:underline decoration-1 underline-offset-2 line-clamp-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-2 mb-2">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-muted)] mt-auto">
          {author && (
            <span className="font-semibold text-[var(--color-brand-black)]">{author.name}</span>
          )}
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
          <Link href={`/berita/${article.slug}`} className="shrink-0 overflow-hidden">
            <div className="relative w-24 h-16">
              <Image
                src={article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover group-hover:opacity-85 transition-opacity duration-300"
              />
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-brand-red)]">
              {category.name}
            </span>
          )}
          <Link href={`/berita/${article.slug}`}>
            <h3
              className="text-sm font-bold leading-snug mt-0.5 mb-1 group-hover:underline decoration-1 underline-offset-2 line-clamp-3"
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
      <article className="group flex-1">
        {category && (
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-brand-red)]">
            {category.name}
          </span>
        )}
        <Link href={`/berita/${article.slug}`}>
          <h3
            className="text-sm font-bold leading-snug mt-0.5 mb-1 group-hover:underline decoration-1 underline-offset-2 line-clamp-2"
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
    <article className="group flex flex-col">
      {article.thumbnail_url && (
        <Link href={`/berita/${article.slug}`} className="block overflow-hidden mb-3">
          <div className="relative aspect-[16/9] w-full bg-[var(--color-subtle)]">
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </Link>
      )}
      {category && (
        <Link
          href={`/kategori/${category.slug}`}
          className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-brand-red)] hover:underline"
        >
          {category.name}
        </Link>
      )}
      <Link href={`/berita/${article.slug}`} className="flex-1">
        <h3
          className="text-base font-bold leading-snug mt-1.5 mb-2 group-hover:underline decoration-1 underline-offset-2 line-clamp-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {article.title}
        </h3>
      </Link>
      {article.excerpt && (
        <p className="text-xs text-[var(--color-muted)] leading-relaxed line-clamp-2 mb-2">
          {article.excerpt}
        </p>
      )}
      <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-muted)] mt-auto">
        {author && (
          <span className="font-semibold text-[var(--color-brand-black)]">{author.name}</span>
        )}
        {author && <span>·</span>}
        <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
      </div>
    </article>
  );
}
