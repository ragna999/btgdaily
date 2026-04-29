import { verifySession } from "@/lib/dal";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await verifySession();

  return (
    <AdminShell name={profile.name} role={profile.role}>
      {children}
    </AdminShell>
  );
}
