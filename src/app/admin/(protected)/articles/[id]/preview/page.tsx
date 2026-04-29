import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatDate, estimateReadTime } from "@/lib/utils";
import { publishArticle, returnToDraft } from "@/app/actions/articles";

type ArticleRow = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: string;
  created_at: string;
  published_at: string | null;
  author: { name: string; avatar_url: string | null } | null;
  category: { name: string; slug: string } | null;
};

type Props = { params: Promise<{ id: string }> };

export default async function ArticlePreviewPage({ params }: Props) {
  const { profile } = await verifySession();
  if (profile.role === "writer") redirect("/admin/articles");

  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("articles")
    .select(
      "id, title, slug, content, excerpt, thumbnail_url, status, created_at, published_at, " +
        "author:users!author_id(name, avatar_url), category:categories!category_id(name, slug)"
    )
    .eq("id", Number(id))
    .single();

  if (error || !data) notFound();

  const row = data as unknown as ArticleRow;
  const author = row.author;
  const category = row.category;
  const readTime = estimateReadTime(row.content);

  const STATUS_LABEL: Record<string, string> = {
    draft: "Draft",
    review: "Menunggu Review",
    published: "Dipublikasikan",
  };

  const STATUS_COLOR: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    review: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
  };

  return (
    <div className="min-h-screen bg-[var(--color-subtle)]">
      {/* Admin action bar */}
      <div className="sticky top-0 z-50 bg-[var(--color-brand-black)] text-white">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/review"
              className="text-xs text-gray-400 hover:text-white shrink-0"
            >
              ← Antrian Review
            </Link>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLOR[row.status] ?? ""}`}
            >
              {STATUS_LABEL[row.status] ?? row.status}
            </span>
          </div>

          {row.status === "review" && (
            <div className="flex items-center gap-2 shrink-0">
              <form action={returnToDraft.bind(null, row.id)}>
                <button
                  type="submit"
                  className="text-xs font-semibold px-3 py-1.5 border border-gray-600 hover:border-gray-400 transition-colors"
                >
                  Kembalikan ke Draft
                </button>
              </form>
              <form action={publishArticle.bind(null, row.id)}>
                <button
                  type="submit"
                  className="text-xs font-semibold px-3 py-1.5 bg-white text-[var(--color-brand-black)] hover:bg-gray-200 transition-colors"
                >
                  Publish
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Article preview */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-[var(--color-border)] p-6 md:p-10">
          {category && (
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-red)] mb-2">
              {category.name}
            </p>
          )}

          <h1
            className="text-3xl md:text-4xl font-bold leading-tight mb-5"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {row.title}
          </h1>

          <div className="pb-5 border-b border-[var(--color-border)] mb-6 space-y-1">
            {author && (
              <p className="text-sm">
                <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-[0.12em] mr-1.5">
                  Oleh
                </span>
                <span className="font-semibold">{author.name}</span>
              </p>
            )}
            <p className="text-xs text-[var(--color-muted)]">
              {formatDate(row.published_at ?? row.created_at)}
              {" · "}
              {readTime} menit baca
            </p>
          </div>

          {row.excerpt && (
            <p className="text-base text-[var(--color-muted)] italic border-l-2 border-[var(--color-border)] pl-4 mb-6">
              {row.excerpt}
            </p>
          )}

          {row.thumbnail_url && (
            <div className="relative aspect-[16/9] w-full mb-8 overflow-hidden">
              <Image
                src={row.thumbnail_url}
                alt={row.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: row.content }}
          />
        </div>
      </main>
    </div>
  );
}
