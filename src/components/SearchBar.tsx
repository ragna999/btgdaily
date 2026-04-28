"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/cari?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-0 w-full sm:w-auto sm:justify-end">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari berita..."
        className="flex-1 sm:flex-none sm:w-64 border border-[var(--color-border)] px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--color-brand-black)] bg-white"
      />
      <button
        type="submit"
        aria-label="Cari"
        className="shrink-0 border border-l-0 border-[var(--color-border)] px-3 py-1.5 bg-[var(--color-brand-black)] text-white hover:bg-gray-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </button>
    </form>
  );
}
