"use client";
import { deleteArticle } from "@/app/actions/articles";

export default function DeleteArticleButton({ id }: { id: number }) {
  async function handleDelete() {
    if (!confirm("Yakin hapus artikel ini?")) return;
    await deleteArticle(id);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-xs text-[var(--color-brand-red)] hover:underline"
    >
      Hapus
    </button>
  );
}
