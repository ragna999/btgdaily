"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

type Role = "admin" | "editor" | "writer";

const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  editor: "Editor",
  writer: "Jurnalis",
};

export default function AdminSidebar({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();
  const isAdmin = role === "admin" || role === "editor";

  const navItems = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/profile", label: "Profil Saya" },
    { href: "/admin/articles", label: isAdmin ? "Semua Artikel" : "Artikel Saya" },
    { href: "/admin/articles/new", label: "Tulis Artikel" },
    ...(isAdmin ? [{ href: "/admin/review", label: "Antrian Review" }] : []),
    ...(role === "admin" ? [{ href: "/admin/users", label: "Pengguna" }] : []),
  ];

  return (
    <aside className="w-56 shrink-0 bg-[var(--color-brand-black)] text-white flex flex-col min-h-screen">
      <div className="px-5 py-5 border-b border-gray-700">
        <p
          className="text-base font-bold leading-tight"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Bantargebang Times
        </p>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
          {ROLE_LABEL[role as Role] ?? "Admin"} Panel
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && !(item.exact === undefined && pathname === "/admin");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 text-sm rounded transition-colors ${
                active
                  ? "bg-white text-[var(--color-brand-black)] font-semibold"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 mb-0.5 truncate">{name}</p>
        <p className="text-[10px] text-gray-600 mb-2">
          {ROLE_LABEL[role as Role] ?? role}
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Keluar →
          </button>
        </form>
      </div>
    </aside>
  );
}
