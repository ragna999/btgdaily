"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({
  name,
  role,
  children,
}: {
  name: string;
  role: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[var(--color-subtle)]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar name={name} role={role} />
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 flex shrink-0">
            <AdminSidebar name={name} role={role} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-[var(--color-brand-black)] text-white shrink-0">
          <button
            onClick={() => setOpen(true)}
            aria-label="Buka menu navigasi"
            className="p-1 -ml-1 rounded hover:bg-gray-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <rect x="0" y="3" width="20" height="2" rx="1" />
              <rect x="0" y="9" width="20" height="2" rx="1" />
              <rect x="0" y="15" width="20" height="2" rx="1" />
            </svg>
          </button>
          <span className="text-sm font-bold tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
            Bantargebang Times
          </span>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
