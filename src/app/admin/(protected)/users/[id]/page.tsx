import Link from "next/link";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { updateUser } from "@/app/actions/users";
import UserForm from "@/components/admin/UserForm";
import type { UserProfile } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export default async function EditUserPage({ params }: Props) {
  const { profile } = await verifySession();
  if (profile.role !== "admin") notFound();

  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("users")
    .select("id, name, email, role, avatar_url, bio, created_at")
    .eq("id", Number(id))
    .single();

  if (!data) notFound();

  const user = data as unknown as UserProfile;
  const boundUpdate = updateUser.bind(null, user.id);

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/users" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-brand-black)]">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
          Edit Pengguna
        </h1>
      </div>
      <div className="bg-white border border-[var(--color-border)] p-6">
        <p className="text-xs text-[var(--color-muted)] mb-4">{user.email}</p>
        <UserForm action={boundUpdate} user={user} submitLabel="Simpan Perubahan" />
      </div>
    </div>
  );
}
