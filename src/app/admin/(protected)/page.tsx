import { verifySession } from "@/lib/dal";
import { supabaseAdmin, supabaseAdmin as supabase } from "@/lib/supabase-admin";
import ProfileForm from "@/components/admin/ProfileForm";
import type { UserProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

type ArticleWithMetrics = {
  id: number;
  title: string;
  slug: string;
  published_at: string;
  article_metrics: { views: number; unique_views: number; avg_read_time: number } | null;
};

async function getStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    { count: totalArticles },
    { count: publishedArticles },
    { count: todayArticles },
    { data: topArticles },
    { data: allMetrics },
    { data: articlesWithMetrics },
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString()),
    supabase
      .from("articles")
      .select("id, title, slug, article_metrics(views)")
      .eq("status", "published")
      .order("article_metrics(views)", { ascending: false })
      .limit(5),
    supabase.from("article_metrics").select("views"),
    supabase
      .from("articles")
      .select("id, title, slug, published_at, article_metrics(views, unique_views, avg_read_time)")
      .eq("status", "published")
      .order("article_metrics(views)", { ascending: false }),
  ]);

  const totalViews = (allMetrics ?? []).reduce(
    (sum, m) => sum + ((m as { views: number }).views ?? 0),
    0
  );

  return {
    totalArticles,
    publishedArticles,
    todayArticles,
    topArticles,
    totalViews,
    articlesWithMetrics: (articlesWithMetrics ?? []) as unknown as ArticleWithMetrics[],
  };
}

function formatAvgRead(seconds: number): string {
  if (!seconds) return "—";
  if (seconds < 60) return `${Math.round(seconds)} dtk`;
  return `${Math.round(seconds / 60)} mnt`;
}

export default async function AdminDashboard() {
  const { user, profile } = await verifySession();

  if (profile.role !== "admin") {
    const { data } = await supabaseAdmin
      .from("users")
      .select("id, name, email, role, avatar_url, bio, is_active, created_at")
      .eq("id", profile.id)
      .single();

    const fullProfile: UserProfile = data ?? {
      id: profile.id,
      name: profile.name,
      email: user.email!,
      role: profile.role,
      avatar_url: null,
      bio: null,
      is_active: true,
      created_at: "",
    };

    return (
      <div className="p-4 md:p-8">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Profil Saya
        </h1>
        <p className="text-sm text-[var(--color-muted)] mb-8">
          Kelola informasi profil dan keamanan akun kamu.
        </p>
        <ProfileForm user={fullProfile} />
      </div>
    );
  }

  const {
    totalArticles,
    publishedArticles,
    todayArticles,
    topArticles,
    totalViews,
    articlesWithMetrics,
  } = await getStats();

  const stats = [
    { label: "Total Artikel", value: totalArticles ?? 0 },
    { label: "Dipublikasikan", value: publishedArticles ?? 0 },
    { label: "Artikel Hari Ini", value: todayArticles ?? 0 },
    { label: "Total Tayangan", value: totalViews.toLocaleString("id-ID") },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1
        className="text-2xl font-bold mb-6"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-[var(--color-border)] p-5"
          >
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-1">
              {s.label}
            </p>
            <p
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top 5 */}
        <div className="bg-white border border-[var(--color-border)] p-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4">
            Top 5 Artikel
          </h2>
          {topArticles && topArticles.length > 0 ? (
            <ol className="space-y-3">
              {topArticles.map((article, i) => (
                <li key={article.id} className="flex items-start gap-3 text-sm">
                  <span
                    className="text-xl font-bold text-[var(--color-border)] w-5 shrink-0"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium leading-snug">{article.title}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {(
                        article.article_metrics as unknown as { views: number } | null
                      )?.views ?? 0}{" "}
                      tayangan
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">Belum ada data.</p>
          )}
        </div>

        {/* Quick summary */}
        <div className="lg:col-span-2 bg-white border border-[var(--color-border)] p-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4">
            Ringkasan Performa
          </h2>
          {articlesWithMetrics.length > 0 ? (
            (() => {
              const withData = articlesWithMetrics.filter((a) => a.article_metrics);
              const totalUniqueViews = withData.reduce(
                (s, a) => s + (a.article_metrics!.unique_views ?? 0),
                0
              );
              const avgRead =
                withData.length > 0
                  ? withData.reduce(
                      (s, a) => s + (a.article_metrics!.avg_read_time ?? 0),
                      0
                    ) / withData.length
                  : 0;
              return (
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-[var(--color-border)] p-4">
                    <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-1">
                      Pengunjung Unik
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {totalUniqueViews.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="border border-[var(--color-border)] p-4">
                    <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-1">
                      Rata-rata Baca
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {formatAvgRead(avgRead)}
                    </p>
                  </div>
                  <div className="border border-[var(--color-border)] p-4">
                    <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-1">
                      Artikel Punya Data
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {withData.length}
                    </p>
                  </div>
                  <div className="border border-[var(--color-border)] p-4">
                    <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-1">
                      Views / Unik
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {totalUniqueViews > 0
                        ? (totalViews / totalUniqueViews).toFixed(1) + "x"
                        : "—"}
                    </p>
                  </div>
                </div>
              );
            })()
          ) : (
            <p className="text-sm text-[var(--color-muted)]">Belum ada data.</p>
          )}
        </div>
      </div>

      {/* Full metrics table */}
      <div className="bg-white border border-[var(--color-border)]">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-bold uppercase tracking-widest">
            Performa Per Artikel
          </h2>
        </div>
        {articlesWithMetrics.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-subtle)]">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                    Judul
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] whitespace-nowrap">
                    Tayangan
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] whitespace-nowrap">
                    Unik
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] whitespace-nowrap">
                    Avg Baca
                  </th>
                </tr>
              </thead>
              <tbody>
                {articlesWithMetrics.map((article, i) => {
                  const m = article.article_metrics;
                  return (
                    <tr
                      key={article.id}
                      className={`border-b border-[var(--color-border)] last:border-0 ${
                        i % 2 === 1 ? "bg-[var(--color-subtle)]" : "bg-white"
                      }`}
                    >
                      <td className="px-5 py-3 font-medium leading-snug max-w-xs">
                        {article.title}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">
                        {(m?.views ?? 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-[var(--color-muted)]">
                        {(m?.unique_views ?? 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-3 text-right text-[var(--color-muted)]">
                        {formatAvgRead(m?.avg_read_time ?? 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-4 text-sm text-[var(--color-muted)]">
            Belum ada artikel yang dipublikasikan.
          </p>
        )}
      </div>
    </div>
  );
}
