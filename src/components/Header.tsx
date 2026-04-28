import Link from "next/link";
import { getCategories } from "@/lib/queries";
import SearchBar from "./SearchBar";
import MarketStrip from "./MarketStrip";

function formatHeaderDate(): string {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function Header() {
  const categories = await getCategories();

  return (
    <header>
      {/* Top utility bar */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <span className="text-[11px] text-[var(--color-muted)] tracking-wide">
            {formatHeaderDate()}
          </span>
          <nav className="flex gap-5">
            <Link
              href="#"
              className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-brand-black)] transition-colors"
            >
              Tentang Kami
            </Link>
            <Link
              href="#"
              className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-brand-black)] transition-colors"
            >
              Kontak
            </Link>
          </nav>
        </div>
      </div>

      {/* Masthead */}
      <div className="border-b-2 border-[var(--color-brand-black)]">
        <div className="max-w-7xl mx-auto px-4 py-7 text-center">
          <Link href="/" className="inline-block group">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-brand-black)] group-hover:opacity-70 transition-opacity duration-200"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Bantargebang Times
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-4 mt-2.5">
            <div className="h-px w-14 bg-[var(--color-border)]" />
            <p className="text-[10px] text-[var(--color-muted)] tracking-[0.25em] uppercase">
              Berita Terkini &middot; Akurat &middot; Terpercaya
            </p>
            <div className="h-px w-14 bg-[var(--color-border)]" />
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="border-b border-[var(--color-border)] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end">
          <SearchBar />
        </div>
      </div>

      {/* Market data strip */}
      <MarketStrip />

      {/* Category nav */}
      <nav className="border-b border-[var(--color-border)] bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center overflow-x-auto scrollbar-none">
            <li>
              <Link
                href="/"
                className="block px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-brand-black)] border-b-2 border-[var(--color-brand-black)] whitespace-nowrap"
              >
                Semua
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/kategori/${cat.slug}`}
                  className="block px-4 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)] hover:text-[var(--color-brand-black)] border-b-2 border-transparent hover:border-[var(--color-brand-black)] transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
