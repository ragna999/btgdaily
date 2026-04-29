import Link from "next/link";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { formatDate } from "@/lib/utils";
import DeleteUserButton from "@/components/admin/DeleteUserButton";
import SuspendUserButton from "@/components/admin/SuspendUserButton";
import type { UserProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  editor: "Editor",
  writer: "Jurnalis",
};

export default async function UsersPage() {
  const { profile } = await verifySession();
  if (profile.role !== "admin") notFound();

  const { data: users } = await supabaseAdmin
    .from("users")
    .select("id, name, email, role, avatar_url, bio, is_active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
          Pengguna
        </h1>
        <Link
          href="/admin/users/new"
          className="bg-[var(--color-brand-black)] text-white text-sm font-semibold px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          + Tambah Pengguna
        </Link>
      </div>

      <div className="bg-white border border-[var(--color-border)]">
        {!users || users.length === 0 ? (
          <p className="p-8 text-sm text-[var(--color-muted)] text-center">Belum ada pengguna.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-subtle)]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Nama</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Bergabung</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(users as UserProfile[]).map((user) => (
                <tr key={user.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-subtle)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-gray-500">{user.name[0].toUpperCase()}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{user.name}</span>
                        {!user.is_active && (
                          <span className="ml-2 text-[10px] font-bold uppercase px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full">
                            Suspended
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[var(--color-muted)]">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {ROLE_LABEL[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[var(--color-muted)] text-xs">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/users/${user.id}`} className="text-xs font-medium hover:underline">
                        Edit
                      </Link>
                      {user.id !== profile.id && (
                        <>
                          <SuspendUserButton id={user.id} isActive={user.is_active ?? true} />
                          <DeleteUserButton id={user.id} />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
