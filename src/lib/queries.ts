import { supabase } from "./supabase";
import type { Article, Category, Tag, TrendingArticle } from "./types";

const ARTICLE_SELECT = `
  id, title, slug, excerpt, thumbnail_url, published_at, is_featured,
  author:users!author_id(id, name, avatar_url, bio),
  category:categories!category_id(id, name, slug),
  article_metrics(views, unique_views)
`;

function toArticles(data: unknown): Article[] {
  return (data as Article[]) ?? [];
}

export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
  const { data } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  return toArticles(data);
}

export async function getLatestArticles(limit = 12): Promise<Article[]> {
  const { data } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  return toArticles(data);
}

export async function getLatestArticlesPaged(
  page: number,
  pageSize = 12
): Promise<{ articles: Article[]; total: number }> {
  const from = (page - 1) * pageSize;
  const { data, count } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);
  return { articles: toArticles(data), total: count ?? 0 };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data } = await supabase
    .from("articles")
    .select(
      `id, title, slug, content, excerpt, thumbnail_url, published_at, is_featured,
       author:users!author_id(id, name, avatar_url, bio),
       category:categories!category_id(id, name, slug),
       article_metrics(views, unique_views, avg_read_time)`
    )
    .eq("status", "published")
    .eq("slug", slug)
    .single();

  if (!data) return null;

  // Separate query for tags so a missing/broken tags table doesn't 404 the article
  const { data: articleTagsData } = await supabase
    .from("article_tags")
    .select("tag:tags(id, name, slug)")
    .eq("article_id", (data as unknown as { id: number }).id);

  const tags = (articleTagsData ?? [])
    .map((at) => (at as unknown as { tag: Tag | null }).tag)
    .filter((t): t is Tag => t !== null);

  return { ...(data as unknown as Article), tags };
}

export async function getArticlesByCategory(
  categorySlug: string,
  limit = 12
): Promise<Article[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];
  const { data } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false })
    .limit(limit);
  return toArticles(data);
}

export async function getArticlesByCategoryPaged(
  categorySlug: string,
  page: number,
  pageSize = 12
): Promise<{ articles: Article[]; total: number }> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return { articles: [], total: 0 };
  const from = (page - 1) * pageSize;
  const { data, count } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT, { count: "exact" })
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);
  return { articles: toArticles(data), total: count ?? 0 };
}

export async function getTrendingArticles(limit = 5): Promise<TrendingArticle[]> {
  const { data } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const articles = toArticles(data);
  const now = Date.now();

  const scored = articles.map((article) => {
    const views = article.article_metrics?.views ?? 0;
    const uniqueViews = article.article_metrics?.unique_views ?? 0;
    const ageHours =
      (now - new Date(article.published_at).getTime()) / (1000 * 60 * 60);
    const decayFactor = Math.max(0, 1 - ageHours / 168);
    const trending_score =
      views * 0.5 * decayFactor + uniqueViews * 0.3 * decayFactor;
    return { ...article, trending_score } as TrendingArticle;
  });

  return scored.sort((a, b) => b.trending_score - a.trending_score).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await supabase.from("categories").select("*").order("name");
  return (data as unknown as Category[]) ?? [];
}

export async function getAuthorById(id: number): Promise<import("./types").Author | null> {
  const { data } = await supabase
    .from("users")
    .select("id, name, role, avatar_url, bio")
    .eq("id", id)
    .single();
  return (data as unknown as import("./types").Author) ?? null;
}

export async function getArticlesByAuthorPaged(
  authorId: number,
  page: number,
  pageSize = 12
): Promise<{ articles: Article[]; total: number }> {
  const from = (page - 1) * pageSize;
  const { data, count } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT, { count: "exact" })
    .eq("status", "published")
    .eq("author_id", authorId)
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);
  return { articles: toArticles(data), total: count ?? 0 };
}

export async function searchArticles(query: string, limit = 20): Promise<Article[]> {
  const q = query.trim();
  if (!q) return [];
  const { data } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
    .order("published_at", { ascending: false })
    .limit(limit);
  return toArticles(data);
}

export async function getTags(): Promise<Tag[]> {
  const { data } = await supabase.from("tags").select("id, name, slug").order("name");
  return (data as unknown as Tag[]) ?? [];
}

export async function getArticleTagIds(articleId: number): Promise<number[]> {
  const { data } = await supabase
    .from("article_tags")
    .select("tag_id")
    .eq("article_id", articleId);
  return (data ?? []).map((r) => (r as { tag_id: number }).tag_id);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as unknown as Category) ?? null;
}

export async function getRelatedArticles(
  articleId: number,
  categoryId: number,
  limit = 4
): Promise<Article[]> {
  const { data } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", articleId)
    .order("published_at", { ascending: false })
    .limit(limit);
  return toArticles(data);
}
