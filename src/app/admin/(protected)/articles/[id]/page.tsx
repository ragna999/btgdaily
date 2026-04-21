import Link from "next/link";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getCategories, getTags, getArticleTagIds } from "@/lib/queries";
import { supabase } from "@/lib/supabase";
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
      .select("id, title, slug, content, excerpt, thumbnail_url, category_id, status, is_featured, published_at, author_id")
      .eq("id", Number(id))
      .single(),
    getCategories(),
    getTags(),
  ]);

  if (!data) notFound();
  if (!isAdmin && data.author_id !== profile.id) notFound();

  const article = data as unknown as Article;
  const boundUpdate = updateArticle.bind(null, article.id);
  const selectedTagIds = await getArticleTagIds(article.id);

  return (
    <div className="p-8 max-w-3xl">
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
