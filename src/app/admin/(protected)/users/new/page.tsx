import Link from "next/link";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { createUser } from "@/app/actions/users";
import UserForm from "@/components/admin/UserForm";

export default async function NewUserPage() {
  const { profile } = await verifySession();
  if (profile.role !== "admin") notFound();

  return (
    <div className="p-4 md:p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/users" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-brand-black)]">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
          Tambah Pengguna
        </h1>
      </div>
      <div className="bg-white border border-[var(--color-border)] p-6">
        <UserForm action={createUser} submitLabel="Buat Akun" />
      </div>
    </div>
  );
}
