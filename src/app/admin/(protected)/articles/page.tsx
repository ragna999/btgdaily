import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { formatDate } from "@/lib/utils";
import DeleteArticleButton from "@/components/admin/DeleteArticleButton";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  published: "bg-green-100 text-green-800",
  review: "bg-yellow-100 text-yellow-800",
  draft: "bg-gray-100 text-gray-600",
};

export default async function ArticlesPage() {
  const { profile } = await verifySession();
  const isAdmin = profile.role === "admin" || profile.role === "editor";

  let query = supabase
    .from("articles")
    .select("id, title, slug, status, is_featured, published_at, created_at, author_id, category:categories!category_id(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (!isAdmin) query = query.eq("author_id", profile.id);

  const { data: articles } = await query;

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Artikel
        </h1>
        <Link
          href="/admin/articles/new"
          className="bg-[var(--color-brand-black)] text-white text-sm font-semibold px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          + Tulis Artikel
        </Link>
      </div>

      <div className="bg-white border border-[var(--color-border)]">
        {!articles || articles.length === 0 ? (
          <p className="p-8 text-sm text-[var(--color-muted)] text-center">
            Belum ada artikel.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-subtle)]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                  Judul
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                  Kategori
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">
                  Tanggal
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-subtle)]"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium leading-snug line-clamp-2 max-w-xs">
                      {article.title}
                    </p>
                    {article.is_featured && (
                      <span className="text-[10px] text-[var(--color-brand-red)] font-bold uppercase">
                        Unggulan
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[var(--color-muted)]">
                    {(article.category as unknown as { name: string } | null)?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        STATUS_STYLE[article.status] ?? ""
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[var(--color-muted)] text-xs">
                    {formatDate(article.published_at ?? article.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="text-xs font-medium hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteArticleButton id={article.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
