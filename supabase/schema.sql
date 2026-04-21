-- ============================================================
-- Bantargebang Daily — Database Schema
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- Users
create table if not exists users (
  id          bigserial primary key,
  name        text not null,
  email       text unique not null,
  password_hash text not null,
  role        text not null default 'writer' check (role in ('writer', 'editor', 'admin')),
  created_at  timestamptz not null default now()
);

-- Categories
create table if not exists categories (
  id    bigserial primary key,
  name  text unique not null,
  slug  text unique not null
);

create index if not exists idx_categories_slug on categories(slug);

-- Articles
create table if not exists articles (
  id            bigserial primary key,
  title         text not null,
  slug          text unique not null,
  content       text not null default '',
  excerpt       text not null default '',
  thumbnail_url text,
  author_id     bigint not null references users(id) on delete restrict,
  category_id   bigint not null references categories(id) on delete restrict,
  status        text not null default 'draft' check (status in ('draft', 'review', 'published')),
  is_featured   boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists idx_articles_slug         on articles(slug);
create index if not exists idx_articles_published_at on articles(published_at desc);
create index if not exists idx_articles_category_id  on articles(category_id);
create index if not exists idx_articles_status       on articles(status);

-- Tags
create table if not exists tags (
  id   bigserial primary key,
  name text unique not null
);

create table if not exists article_tags (
  article_id bigint not null references articles(id) on delete cascade,
  tag_id     bigint not null references tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- Article metrics
create table if not exists article_metrics (
  article_id   bigint primary key references articles(id) on delete cascade,
  views        bigint not null default 0,
  unique_views bigint not null default 0,
  avg_read_time numeric(5,2) not null default 0,
  bounce_rate   numeric(5,2) not null default 0
);

create index if not exists idx_article_metrics_views on article_metrics(views desc);

-- Events (append-only analytics)
create table if not exists events (
  id          bigserial primary key,
  article_id  bigint references articles(id) on delete set null,
  event_type  text not null,
  session_id  text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_events_article_id on events(article_id);
create index if not exists idx_events_created_at on events(created_at desc);

-- ============================================================
-- RPC: increment_article_views
-- Dipanggil setiap artikel dibuka
-- ============================================================
create or replace function increment_article_views(article_id bigint)
returns void language plpgsql security definer as $$
begin
  insert into article_metrics(article_id, views, unique_views)
  values (article_id, 1, 1)
  on conflict (article_id) do update
    set views = article_metrics.views + 1;
end;
$$;

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table articles       enable row level security;
alter table categories     enable row level security;
alter table users          enable row level security;
alter table article_metrics enable row level security;
alter table events         enable row level security;

-- Public: baca artikel yang sudah published
create policy "public read published articles"
  on articles for select
  using (status = 'published');

-- Public: baca semua kategori
create policy "public read categories"
  on categories for select
  using (true);

-- Public: baca metrics
create policy "public read metrics"
  on article_metrics for select
  using (true);

-- ============================================================
-- Seed: kategori awal
-- ============================================================
insert into categories (name, slug) values
  ('Lokal',    'lokal'),
  ('Nasional', 'nasional'),
  ('Ekonomi',  'ekonomi'),
  ('Olahraga', 'olahraga'),
  ('Hiburan',  'hiburan'),
  ('Lingkungan','lingkungan')
on conflict (slug) do nothing;
