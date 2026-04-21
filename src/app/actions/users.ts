"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifySession } from "@/lib/dal";
import { createClient } from "@/lib/supabase-server";

async function requireAdmin() {
  const { profile } = await verifySession();
  if (profile.role !== "admin") throw new Error("Akses ditolak.");
  return profile;
}

export async function createUser(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  await requireAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const bio = (formData.get("bio") as string) || null;
  const avatar_url = (formData.get("avatar_url") as string) || null;

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) return { error: authError.message };

  const { error: dbError } = await supabaseAdmin.from("users").insert({
    name,
    email,
    password_hash: "-",
    role,
    bio,
    avatar_url,
  });

  if (dbError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return { error: dbError.message };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(
  id: number,
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  await requireAdmin();

  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const bio = (formData.get("bio") as string) || null;
  const avatar_url = (formData.get("avatar_url") as string) || null;
  const newPassword = formData.get("password") as string;

  const { error } = await supabaseAdmin
    .from("users")
    .update({ name, role, bio, avatar_url })
    .eq("id", id);

  if (error) return { error: error.message };

  if (newPassword) {
    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("email")
      .eq("id", id)
      .single();

    if (userData) {
      const { data: authUser } = await supabaseAdmin.auth.admin.listUsers();
      const match = authUser.users.find((u) => u.email === userData.email);
      if (match) {
        await supabaseAdmin.auth.admin.updateUserById(match.id, { password: newPassword });
      }
    }
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateProfile(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const { user, profile } = await verifySession();

  const name = formData.get("name") as string;
  const bio = (formData.get("bio") as string) || null;
  const avatar_url = (formData.get("avatar_url") as string) || null;
  const oldPassword = formData.get("old_password") as string;
  const newPassword = formData.get("new_password") as string;

  const { error } = await supabaseAdmin
    .from("users")
    .update({ name, bio, avatar_url })
    .eq("id", profile.id);

  if (error) return { error: error.message };

  if (newPassword) {
    if (!oldPassword) return { error: "Masukkan password lama untuk mengubah password." };

    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: oldPassword,
    });
    if (signInError) return { error: "Password lama tidak benar." };

    const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });
    if (pwError) return { error: pwError.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function toggleUserActive(id: number) {
  const { profile } = await verifySession();
  if (profile.role !== "admin") return;
  if (id === profile.id) return;

  const { data } = await supabaseAdmin
    .from("users")
    .select("is_active")
    .eq("id", id)
    .single();

  if (!data) return;

  await supabaseAdmin
    .from("users")
    .update({ is_active: !data.is_active })
    .eq("id", id);

  revalidatePath("/admin/users");
}

export async function deleteUser(id: number) {
  await requireAdmin();

  const { data: userData } = await supabaseAdmin
    .from("users")
    .select("email")
    .eq("id", id)
    .single();

  if (userData) {
    const { data: authList } = await supabaseAdmin.auth.admin.listUsers();
    const match = authList.users.find((u) => u.email === userData.email);
    if (match) await supabaseAdmin.auth.admin.deleteUser(match.id);
  }

  await supabaseAdmin.from("users").delete().eq("id", id);
  revalidatePath("/admin/users");
}
