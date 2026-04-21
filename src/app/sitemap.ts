import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bantargebangdaily.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: articles }, { data: categories }] = await Promise.all([
    supabase
      .from("articles")
      .select("slug, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(1000),
    supabase.from("categories").select("slug"),
  ]);

  const articleUrls: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${BASE_URL}/berita/${a.slug}`,
    lastModified: new Date(a.published_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${BASE_URL}/kategori/${c.slug}`,
    changeFrequency: "hourly",
    priority: 0.6,
  }));

  return [
    { url: BASE_URL, changeFrequency: "always", priority: 1.0 },
    ...categoryUrls,
    ...articleUrls,
  ];
}
