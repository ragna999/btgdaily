"use client";
import { deleteUser } from "@/app/actions/users";

export default function DeleteUserButton({ id }: { id: number }) {
  async function handleDelete() {
    if (!confirm("Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.")) return;
    await deleteUser(id);
  }

  return (
    <button onClick={handleDelete} className="text-xs text-red-500 hover:text-red-700 font-medium">
      Hapus
    </button>
  );
}
