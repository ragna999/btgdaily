import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { publishArticle, returnToDraft } from "@/app/actions/articles";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const { profile } = await verifySession();
  if (profile.role === "writer") redirect("/admin/articles");

  const { data: articles } = await supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, created_at, author:users!author_id(name), category:categories!category_id(name)"
    )
    .eq("status", "review")
    .order("created_at", { ascending: true });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Antrian Review
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Artikel yang dikirim jurnalis dan menunggu persetujuan.
        </p>
      </div>

      {!articles || articles.length === 0 ? (
        <div className="bg-white border border-[var(--color-border)] p-12 text-center">
          <p className="text-sm text-[var(--color-muted)]">
            Tidak ada artikel yang menunggu review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => {
            const author = article.author as unknown as { name: string } | null;
            const category = article.category as unknown as { name: string } | null;

            return (
              <div
                key={article.id}
                className="bg-white border border-[var(--color-border)] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {category && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] border border-[var(--color-border)] px-1.5 py-0.5">
                          {category.name}
                        </span>
                      )}
                      <span className="text-[10px] text-[var(--color-muted)]">
                        {author?.name ?? "—"} · {formatDate(article.created_at)}
                      </span>
                    </div>
                    <h2 className="font-bold text-base leading-snug mb-2">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-sm text-[var(--color-muted)] line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <form action={publishArticle.bind(null, article.id)}>
                      <button
                        type="submit"
                        className="w-full bg-[var(--color-brand-black)] text-white text-xs font-semibold px-4 py-2 hover:bg-gray-800 transition-colors"
                      >
                        Publish
                      </button>
                    </form>
                    <form action={returnToDraft.bind(null, article.id)}>
                      <button
                        type="submit"
                        className="w-full border border-[var(--color-border)] text-xs font-semibold px-4 py-2 hover:bg-[var(--color-subtle)] transition-colors"
                      >
                        Kembalikan ke Draft
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
