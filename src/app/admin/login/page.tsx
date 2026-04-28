"use client";
import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-[var(--color-subtle)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-[var(--color-border)] p-8">
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Bantargebang Times
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1 uppercase tracking-widest">
            Admin Panel
          </p>
        </div>

        <form action={action} className="space-y-4">
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
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
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
            {pending ? "Masuk..." : "Masuk"}
          </button>

          <div className="text-center">
            <Link
              href="/admin/forgot-password"
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-brand-black)]"
            >
              Lupa password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
