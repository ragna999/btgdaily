import Link from "next/link";
import { getCategories } from "@/lib/queries";
import SearchBar from "./SearchBar";

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
      {/* Top bar */}
      <div className="bg-[var(--color-brand-black)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
          <span className="text-gray-400">{formatHeaderDate()}</span>
          <nav className="flex gap-4 text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">Tentang Kami</Link>
            <Link href="#" className="hover:text-white transition-colors">Kontak</Link>
          </nav>
        </div>
      </div>

      {/* Masthead */}
      <div className="border-b-2 border-[var(--color-brand-black)]">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <Link href="/" className="inline-block">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-brand-black)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Bantargebang Daily
            </h1>
          </Link>
          <p className="text-xs text-[var(--color-muted)] mt-1 tracking-widest uppercase">
            Berita Terkini · Akurat · Terpercaya
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-subtle)]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end">
          <SearchBar />
        </div>
      </div>

      {/* Category nav */}
      <nav className="border-b border-[var(--color-border)] bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-0 overflow-x-auto scrollbar-none">
            <li>
              <Link
                href="/"
                className="block px-4 py-3 text-sm font-semibold text-[var(--color-brand-black)] hover:text-[var(--color-brand-red)] border-b-2 border-transparent hover:border-[var(--color-brand-red)] transition-colors whitespace-nowrap"
              >
                Semua
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/kategori/${cat.slug}`}
                  className="block px-4 py-3 text-sm font-medium text-[var(--color-brand-black)] hover:text-[var(--color-brand-red)] border-b-2 border-transparent hover:border-[var(--color-brand-red)] transition-colors whitespace-nowrap"
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
