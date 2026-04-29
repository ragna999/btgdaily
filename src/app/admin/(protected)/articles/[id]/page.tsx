import Link from "next/link";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getCategories, getTags, getArticleTagIds } from "@/lib/queries";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import ArticleForm from "@/components/admin/ArticleForm";
import { updateArticle } from "@/app/actions/articles";
import type { Article } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
  const { profile } = await verifySession();
  const isAdmin = profile.role === "admin" || profile.role === "editor";
  const { id } = await params;

  const [{ data }, categories, tags] = await Promise.all([
    supabase
      .from("articles")
      .select("id, title, slug, content, excerpt, thumbnail_url, category_id, status, is_featured, published_at, author_id, review_notes")
      .eq("id", Number(id))
      .single(),
    getCategories(),
    getTags(),
  ]);

  if (!data) notFound();
  if (!isAdmin && data.author_id !== profile.id) notFound();

  const article = data as unknown as Article;
  const reviewNotes = (data as unknown as { review_notes: string | null }).review_notes;
  const boundUpdate = updateArticle.bind(null, article.id);
  const selectedTagIds = await getArticleTagIds(article.id);

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
          Edit Artikel
        </h1>
      </div>

      {reviewNotes && article.status === "draft" && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 mb-4 text-sm">
          <p className="font-semibold text-yellow-800 mb-1">Catatan dari reviewer:</p>
          <p className="text-yellow-700 whitespace-pre-wrap">{reviewNotes}</p>
        </div>
      )}

      <div className="bg-white border border-[var(--color-border)] p-6">
        <ArticleForm
          action={boundUpdate}
          categories={categories}
          tags={tags}
          selectedTagIds={selectedTagIds}
          article={article}
          role={profile.role}
          submitLabel="Perbarui Artikel"
        />
      </div>
    </div>
  );
}
