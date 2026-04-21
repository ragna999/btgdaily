export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Author {
  id: number;
  name: string;
  role: "writer" | "editor" | "admin";
  avatar_url?: string | null;
  bio?: string | null;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "writer" | "editor" | "admin";
  avatar_url: string | null;
  bio: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ArticleMetrics {
  article_id: number;
  views: number;
  unique_views: number;
  avg_read_time: number;
  bounce_rate: number;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail_url: string | null;
  author_id: number;
  category_id: number;
  status: "draft" | "review" | "published";
  is_featured: boolean;
  published_at: string;
  created_at: string;
  author?: Author;
  category?: Category;
  tags?: Tag[];
  article_metrics?: ArticleMetrics;
}

export interface TrendingArticle extends Article {
  trending_score: number;
}
