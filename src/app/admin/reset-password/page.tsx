import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--color-subtle)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-[var(--color-border)] p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
            Bantargebang Daily
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1 uppercase tracking-widest">
            Password Baru
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-center text-[var(--color-muted)]">Memuat...</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
