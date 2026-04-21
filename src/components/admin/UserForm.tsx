"use client";
import { useActionState, useState } from "react";
import type { UserProfile } from "@/lib/types";
import ImageUpload from "./ImageUpload";

type ActionState = { error: string } | null;

interface Props {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  user?: UserProfile;
  submitLabel?: string;
}

export default function UserForm({ action, user, submitLabel = "Simpan" }: Props) {
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? "");
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="avatar_url" value={avatarUrl} />

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          Nama *
        </label>
        <input
          name="name"
          defaultValue={user?.name ?? ""}
          required
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)]"
          placeholder="Nama lengkap"
        />
      </div>

      {!user && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)]"
            placeholder="email@example.com"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          {user ? "Password Baru (kosongkan jika tidak diubah)" : "Password *"}
        </label>
        <input
          name="password"
          type="password"
          required={!user}
          minLength={8}
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)]"
          placeholder={user ? "••••••••" : "Min. 8 karakter"}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          Role *
        </label>
        <select
          name="role"
          defaultValue={user?.role ?? "writer"}
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)] bg-white"
        >
          <option value="writer">Jurnalis</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
          Foto Profil
        </label>
        <ImageUpload defaultUrl={user?.avatar_url ?? undefined} onChange={setAvatarUrl} />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          defaultValue={user?.bio ?? ""}
          rows={3}
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)] resize-none"
          placeholder="Deskripsi singkat tentang jurnalis..."
        />
      </div>

      {state?.error && (
        <p className="text-xs text-[var(--color-brand-red)]">{state.error}</p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-[var(--color-brand-black)] text-white text-sm font-semibold px-6 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
