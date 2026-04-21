"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

type Stage = "exchanging" | "form" | "success" | "error";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("exchanging");
  const [exchangeError, setExchangeError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setExchangeError("Link tidak valid atau sudah kadaluarsa.");
      setStage("error");
      return;
    }

    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setExchangeError("Link tidak valid atau sudah kadaluarsa. Minta link baru.");
        setStage("error");
      } else {
        setStage("form");
      }
    });
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (password !== confirm) {
      setFormError("Konfirmasi password tidak cocok.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password minimal 8 karakter.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (error) {
      setFormError(error.message);
    } else {
      setStage("success");
      setTimeout(() => router.push("/admin/login"), 3000);
    }
  }

  if (stage === "exchanging") {
    return (
      <p className="text-sm text-center text-[var(--color-muted)]">Memverifikasi link...</p>
    );
  }

  if (stage === "error") {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-[var(--color-brand-red)] bg-red-50 border border-red-200 px-4 py-3">
          {exchangeError}
        </p>
        <Link
          href="/admin/forgot-password"
          className="text-xs text-[var(--color-muted)] hover:text-[var(--color-brand-black)]"
        >
          Minta link reset baru →
        </Link>
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="text-center">
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3">
          Password berhasil diubah. Mengalihkan ke halaman login...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          Password Baru
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)]"
          placeholder="Min. 8 karakter"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
          Konfirmasi Password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)]"
          placeholder="Ulangi password baru"
        />
      </div>

      {formError && (
        <p className="text-xs text-[var(--color-brand-red)]">{formError}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[var(--color-brand-black)] text-white text-sm font-semibold py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {pending ? "Menyimpan..." : "Simpan Password Baru"}
      </button>
    </form>
  );
}
