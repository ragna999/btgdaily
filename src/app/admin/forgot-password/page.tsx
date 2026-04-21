"use client";
import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(forgotPasswordAction, null);

  return (
    <div className="min-h-screen bg-[var(--color-subtle)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-[var(--color-border)] p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
            Bantargebang Daily
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1 uppercase tracking-widest">
            Reset Password
          </p>
        </div>

        {state?.success ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3">
              Link reset password telah dikirim ke email kamu. Cek inbox (dan folder spam).
            </p>
            <Link
              href="/admin/login"
              className="block text-xs text-[var(--color-muted)] hover:text-[var(--color-brand-black)]"
            >
              ← Kembali ke login
            </Link>
          </div>
        ) : (
          <form action={action} className="space-y-4">
            <p className="text-sm text-[var(--color-muted)] mb-4">
              Masukkan email akunmu. Kami akan mengirimkan link untuk mereset password.
            </p>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand-black)]"
              />
            </div>

            {state?.error && (
              <p className="text-xs text-[var(--color-brand-red)]">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[var(--color-brand-black)] text-white text-sm font-semibold py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {pending ? "Mengirim..." : "Kirim Link Reset"}
            </button>

            <div className="text-center">
              <Link
                href="/admin/login"
                className="text-xs text-[var(--color-muted)] hover:text-[var(--color-brand-black)]"
              >
                ← Kembali ke login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
