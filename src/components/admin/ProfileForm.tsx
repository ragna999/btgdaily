"use client";
import { useActionState, useState } from "react";
import type { UserProfile } from "@/lib/types";
import ImageUpload from "./ImageUpload";
import { updateProfile } from "@/app/actions/users";

type State = { error?: string; success?: boolean } | null;

export default function ProfileForm({ user }: { user: UserProfile }) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url ?? "");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [state, action, pending] = useActionState(updateProfile, null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (newPw && newPw !== confirmPw) {
      e.preventDefault();
      setConfirmError("Konfirmasi password tidak cocok.");
      return;
    }
    setConfirmError("");
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <input type="hidden" name="avatar_url" value={avatarUrl} />

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          Email
        </label>
        <input
          value={user.email}
          readOnly
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm bg-[var(--color-subtle)] text-[var(--color-muted)] cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          Nama *
        </label>
        <input
          name="name"
          defaultValue={user.name}
          required
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)]"
          placeholder="Nama lengkap"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
          Foto Profil
        </label>
        <ImageUpload defaultUrl={user.avatar_url ?? undefined} onChange={setAvatarUrl} />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          defaultValue={user.bio ?? ""}
          rows={3}
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)] resize-none"
          placeholder="Deskripsi singkat tentang dirimu..."
        />
      </div>

      <div className="border-t border-[var(--color-border)] pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider mb-4">
          Ubah Password
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
              Password Lama
            </label>
            <input
              name="old_password"
              type="password"
              className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)]"
              placeholder="Masukkan password lama"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
              Password Baru
            </label>
            <input
              name="new_password"
              type="password"
              minLength={8}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)]"
              placeholder="Min. 8 karakter"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)]"
              placeholder="Ulangi password baru"
            />
            {confirmError && (
              <p className="text-xs text-[var(--color-brand-red)] mt-1">{confirmError}</p>
            )}
          </div>
        </div>
      </div>

      {state?.error && (
        <p className="text-xs text-[var(--color-brand-red)]">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-xs text-green-600">Profil berhasil diperbarui.</p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-[var(--color-brand-black)] text-white text-sm font-semibold px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
