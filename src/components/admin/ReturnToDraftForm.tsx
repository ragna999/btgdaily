"use client";
import { useState } from "react";
import { returnToDraftWithNotes } from "@/app/actions/articles";

export default function ReturnToDraftForm({ articleId }: { articleId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold px-3 py-1.5 border border-gray-600 hover:border-gray-400 transition-colors"
      >
        Kembalikan ke Draft
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white w-full max-w-md mx-4 p-6">
            <h2
              className="text-lg font-bold mb-1"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Kembalikan ke Draft
            </h2>
            <p className="text-sm text-[var(--color-muted)] mb-4">
              Tambahkan catatan untuk penulis agar mereka tahu apa yang perlu diperbaiki.
            </p>

            <form action={returnToDraftWithNotes}>
              <input type="hidden" name="id" value={articleId} />
              <textarea
                name="notes"
                rows={5}
                placeholder="Catatan untuk penulis (opsional)..."
                className="w-full border border-[var(--color-border)] p-3 text-sm resize-none focus:outline-none focus:border-[var(--color-brand-black)] mb-4"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold px-4 py-2 border border-[var(--color-border)] hover:bg-[var(--color-subtle)] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="text-xs font-semibold px-4 py-2 bg-[var(--color-brand-black)] text-white hover:bg-gray-800 transition-colors"
                >
                  Kembalikan ke Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
