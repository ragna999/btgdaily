import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function pageHref(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-10">
      {currentPage > 1 && (
        <Link
          href={pageHref(basePath, currentPage - 1)}
          className="px-3 py-1.5 text-sm border border-[var(--color-border)] hover:bg-[var(--color-subtle)] transition-colors"
        >
          ← Sebelumnya
        </Link>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-sm text-[var(--color-muted)]">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(basePath, p)}
            className={`px-3 py-1.5 text-sm border transition-colors ${
              p === currentPage
                ? "bg-[var(--color-brand-black)] text-white border-[var(--color-brand-black)]"
                : "border-[var(--color-border)] hover:bg-[var(--color-subtle)]"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={pageHref(basePath, currentPage + 1)}
          className="px-3 py-1.5 text-sm border border-[var(--color-border)] hover:bg-[var(--color-subtle)] transition-colors"
        >
          Berikutnya →
        </Link>
      )}
    </nav>
  );
}
