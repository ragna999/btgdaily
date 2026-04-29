"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/dal";

async function syncTags(articleId: number, tagIdsRaw: string) {
  await supabase.from("article_tags").delete().eq("article_id", articleId);
  const ids = tagIdsRaw.split(",").map(Number).filter(Boolean);
  if (ids.length > 0) {
    await supabase
      .from("article_tags")
      .insert(ids.map((tag_id) => ({ article_id: articleId, tag_id })));
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function createArticle(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const { profile } = await verifySession();
  const isAdmin = profile.role === "admin" || profile.role === "editor";

  const title = formData.get("title") as string;
  const slug =
    (formData.get("slug") as string) || generateSlug(title);
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const thumbnail_url = (formData.get("thumbnail_url") as string) || null;
  const category_id = Number(formData.get("category_id"));
  const rawStatus = formData.get("status") as string;
  const status = !isAdmin && rawStatus === "published" ? "review" : rawStatus;
  const is_featured = isAdmin ? formData.get("is_featured") === "on" : false;
  const published_at =
    status === "published" ? new Date().toISOString() : null;

  const { data: inserted, error } = await supabase
    .from("articles")
    .insert({
      title,
      slug,
      excerpt,
      content,
      thumbnail_url,
      category_id,
      author_id: profile.id,
      status,
      is_featured,
      published_at,
    })
    .select("id")
    .single();

  if (error || !inserted) return { error: error?.message ?? "Gagal menyimpan artikel." };

  const tagIds = formData.get("tag_ids") as string;
  if (tagIds !== null) await syncTags(inserted.id, tagIds);

  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateArticle(
  id: number,
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const { profile } = await verifySession();
  const isAdmin = profile.role === "admin" || profile.role === "editor";

  if (!isAdmin) {
    const { data: existing } = await supabase
      .from("articles")
      .select("author_id")
      .eq("id", id)
      .single();
    if (!existing || existing.author_id !== profile.id) return { error: "Akses ditolak." };
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const thumbnail_url = (formData.get("thumbnail_url") as string) || null;
  const category_id = Number(formData.get("category_id"));
  const rawStatus = formData.get("status") as string;
  const status = !isAdmin && rawStatus === "published" ? "review" : rawStatus;
  const is_featured = isAdmin ? formData.get("is_featured") === "on" : false;

  const updateData: Record<string, unknown> = {
    title,
    slug,
    excerpt,
    content,
    thumbnail_url,
    category_id,
    status,
    is_featured,
  };

  if (status === "published") {
    const { data: existing } = await supabase
      .from("articles")
      .select("published_at, status")
      .eq("id", id)
      .single();
    if (existing && existing.status !== "published") {
      updateData.published_at = new Date().toISOString();
    }
  }

  const { error } = await supabase
    .from("articles")
    .update(updateData)
    .eq("id", id);

  if (error) return { error: error.message };

  const tagIds = formData.get("tag_ids") as string;
  if (tagIds !== null) await syncTags(id, tagIds);

  revalidatePath("/");
  revalidatePath(`/berita/${slug}`);
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function publishArticle(id: number) {
  const { profile } = await verifySession();
  if (profile.role === "writer") return;

  const { data: existing } = await supabase
    .from("articles")
    .select("published_at, slug")
    .eq("id", id)
    .single();

  const updateData: Record<string, unknown> = { status: "published" };
  if (existing && !existing.published_at) {
    updateData.published_at = new Date().toISOString();
  }

  await supabase.from("articles").update(updateData).eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/review");
  revalidatePath("/admin/articles");
  if (existing?.slug) revalidatePath(`/berita/${existing.slug}`);
}

export async function returnToDraft(id: number) {
  const { profile } = await verifySession();
  if (profile.role === "writer") return;

  await supabase.from("articles").update({ status: "draft" }).eq("id", id);

  revalidatePath("/admin/review");
  revalidatePath("/admin/articles");
}

export async function returnToDraftWithNotes(formData: FormData) {
  const { profile } = await verifySession();
  if (profile.role === "writer") return;

  const id = Number(formData.get("id"));
  const notes = (formData.get("notes") as string).trim() || null;

  await supabase
    .from("articles")
    .update({ status: "draft", review_notes: notes })
    .eq("id", id);

  revalidatePath("/admin/review");
  revalidatePath("/admin/articles");
  redirect("/admin/review");
}

export async function deleteArticle(id: number) {
  const { profile } = await verifySession();
  const isAdmin = profile.role === "admin" || profile.role === "editor";

  if (!isAdmin) {
    const { data: existing } = await supabase
      .from("articles")
      .select("author_id")
      .eq("id", id)
      .single();
    if (!existing || existing.author_id !== profile.id) return;
  }

  await supabase.from("articles").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/articles");
}
