"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import type { Article, Category, Tag } from "@/lib/types";
import ImageUpload from "./ImageUpload";
import RichEditor from "./RichEditor";

type ActionState = { error: string } | null;

interface Props {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  categories: Category[];
  tags?: Tag[];
  selectedTagIds?: number[];
  article?: Article;
  role?: string;
  submitLabel?: string;
}

interface DraftData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  savedAt: number;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function timeAgo(timestamp: number): string {
  const mins = Math.floor((Date.now() - timestamp) / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

export default function ArticleForm({
  action,
  categories,
  tags = [],
  selectedTagIds = [],
  article,
  role,
  submitLabel = "Simpan",
}: Props) {
  const isWriter = role === "writer";
  const draftKey = `article-draft-${article?.id ?? "new"}`;

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!article?.slug);
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(article?.thumbnail_url ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [checkedTags, setCheckedTags] = useState<Set<number>>(new Set(selectedTagIds));

  const [draftBanner, setDraftBanner] = useState<DraftData | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, formAction, pending] = useActionState(action, null);

  // Load saved draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft: DraftData = JSON.parse(raw);
      // Only show banner if draft is different from current values
      if (draft.title !== (article?.title ?? "") || draft.content !== (article?.content ?? "")) {
        setDraftBanner(draft);
      } else {
        localStorage.removeItem(draftKey);
      }
    } catch {
      // ignore corrupt data
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save on change (debounced 1.5s)
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        const draft: DraftData = { title, slug, excerpt, content, savedAt: Date.now() };
        localStorage.setItem(draftKey, JSON.stringify(draft));
      } catch {
        // storage might be full or unavailable
      }
    }, 1500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [title, slug, excerpt, content, draftKey]);

  useEffect(() => {
    if (!slugEdited && title) setSlug(slugify(title));
  }, [title, slugEdited]);

  function restoreDraft() {
    if (!draftBanner) return;
    setTitle(draftBanner.title);
    setSlug(draftBanner.slug);
    setExcerpt(draftBanner.excerpt);
    setContent(draftBanner.content);
    setSlugEdited(true);
    setDraftBanner(null);
  }

  function dismissDraft() {
    localStorage.removeItem(draftKey);
    setDraftBanner(null);
  }

  function handleSubmit() {
    localStorage.removeItem(draftKey);
    setDraftBanner(null);
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
      {/* Draft restore banner */}
      {draftBanner && (
        <div className="flex items-center justify-between gap-4 bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm">
          <span className="text-yellow-800">
            Draft tersimpan ditemukan ({timeAgo(draftBanner.savedAt)}).
          </span>
          <div className="flex gap-3 shrink-0">
            <button
              type="button"
              onClick={restoreDraft}
              className="text-xs font-semibold text-yellow-800 hover:underline"
            >
              Pulihkan
            </button>
            <button
              type="button"
              onClick={dismissDraft}
              className="text-xs text-yellow-600 hover:underline"
            >
              Abaikan
            </button>
          </div>
        </div>
      )}

      {/* Hidden fields */}
      <input type="hidden" name="thumbnail_url" value={thumbnailUrl} />
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="tag_ids" value={Array.from(checkedTags).join(",")} />

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          Judul *
        </label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)]"
          placeholder="Judul artikel..."
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          Slug *
        </label>
        <input
          name="slug"
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
          required
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm font-mono focus:outline-none focus:border-[var(--color-brand-black)]"
          placeholder="url-artikel"
        />
        <p className="text-[10px] text-[var(--color-muted)] mt-1">
          URL: /berita/{slug || "..."}
        </p>
      </div>

      {/* Row: category + status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
            Kategori *
          </label>
          <select
            name="category_id"
            defaultValue={article?.category_id ?? ""}
            required
            className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)] bg-white"
          >
            <option value="" disabled>Pilih kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
            Status *
          </label>
          <select
            name="status"
            defaultValue={article?.status ?? "draft"}
            className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)] bg-white"
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            {!isWriter && <option value="published">Published</option>}
          </select>
        </div>
      </div>

      {/* Thumbnail upload */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
          Thumbnail
        </label>
        <ImageUpload
          defaultUrl={article?.thumbnail_url}
          onChange={setThumbnailUrl}
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          Ringkasan (Excerpt) *
        </label>
        <textarea
          name="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          rows={2}
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)] resize-none"
          placeholder="Deskripsi singkat artikel (tampil di homepage & SEO)..."
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
          Konten *
        </label>
        <RichEditor
          defaultValue={content}
          onChange={setContent}
        />
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
            Tag
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const checked = checkedTags.has(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    setCheckedTags((prev) => {
                      const next = new Set(prev);
                      if (next.has(tag.id)) next.delete(tag.id);
                      else next.add(tag.id);
                      return next;
                    });
                  }}
                  className={`text-xs px-3 py-1 border transition-colors ${
                    checked
                      ? "bg-[var(--color-brand-black)] text-white border-[var(--color-brand-black)]"
                      : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-brand-black)] hover:text-[var(--color-brand-black)]"
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured — admin/editor only */}
      {!isWriter && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_featured"
            id="is_featured"
            defaultChecked={article?.is_featured ?? false}
            className="w-4 h-4"
          />
          <label htmlFor="is_featured" className="text-sm font-medium">
            Tampilkan sebagai artikel unggulan (featured)
          </label>
        </div>
      )}

      {state?.error && (
        <p className="text-xs text-[var(--color-brand-red)]">{state.error}</p>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-[var(--color-brand-black)] text-white text-sm font-semibold px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
