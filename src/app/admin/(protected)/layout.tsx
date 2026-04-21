import { verifySession } from "@/lib/dal";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await verifySession();

  return (
    <div className="flex min-h-screen bg-[var(--color-subtle)]">
      <AdminSidebar name={profile.name} role={profile.role} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
