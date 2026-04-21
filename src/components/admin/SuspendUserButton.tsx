"use client";
import { toggleUserActive } from "@/app/actions/users";

interface Props {
  id: number;
  isActive: boolean;
}

export default function SuspendUserButton({ id, isActive }: Props) {
  async function handleToggle() {
    if (!isActive) {
      await toggleUserActive(id);
      return;
    }
    if (!confirm("Suspend akun ini? Pengguna tidak akan bisa login sampai diaktifkan kembali.")) return;
    await toggleUserActive(id);
  }

  return (
    <button
      onClick={handleToggle}
      className={`text-xs font-medium ${
        isActive
          ? "text-yellow-600 hover:text-yellow-800"
          : "text-green-600 hover:text-green-800"
      }`}
    >
      {isActive ? "Suspend" : "Aktifkan"}
    </button>
  );
}
