import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { getCategories, getTags } from "@/lib/queries";
import ArticleForm from "@/components/admin/ArticleForm";
import { createArticle } from "@/app/actions/articles";

export default async function NewArticlePage() {
  const { profile } = await verifySession();
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/articles"
          className="text-xs text-[var(--color-muted)] hover:text-[var(--color-brand-black)]"
        >
          ← Kembali
        </Link>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Tulis Artikel Baru
        </h1>
      </div>

      <div className="bg-white border border-[var(--color-border)] p-6">
        <ArticleForm
          action={createArticle}
          categories={categories}
          tags={tags}
          role={profile.role}
          submitLabel="Simpan Artikel"
        />
      </div>
    </div>
  );
}
