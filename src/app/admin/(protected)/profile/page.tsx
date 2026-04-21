import { verifySession } from "@/lib/dal";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ProfileForm from "@/components/admin/ProfileForm";
import type { UserProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { user, profile } = await verifySession();

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
    <div className="p-8">
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
