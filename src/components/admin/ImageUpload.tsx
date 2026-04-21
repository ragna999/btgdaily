"use client";
import { useRef, useState } from "react";

interface Props {
  defaultUrl?: string | null;
  onChange: (url: string) => void;
}

const MAX_WARN_MB = 1;
const COMPRESSOR_URL = "https://ganbaro.vercel.app/file-compressor";
const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif";

export default function ImageUpload({ defaultUrl, onChange }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWarn, setShowWarn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setShowWarn(false);

    if (file.size > MAX_WARN_MB * 1024 * 1024) {
      setShowWarn(true);
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Upload gagal");

      setPreviewUrl(json.url);
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }

  return (
    <div className="space-y-2">
      {showWarn && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          <span className="mt-0.5">⚠</span>
          <p>
            Gambar ini lebih dari {MAX_WARN_MB}MB. Untuk performa lebih baik,{" "}
            <a
              href={COMPRESSOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline hover:text-amber-900"
            >
              kompress dulu di sini
            </a>{" "}
            sebelum upload.
          </p>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-brand-black)] transition-colors cursor-pointer bg-[var(--color-subtle)] overflow-hidden"
      >
        {previewUrl ? (
          <div className="relative w-full aspect-video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-medium">Ganti gambar</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <p className="text-2xl mb-2">🖼</p>
            <p className="text-sm font-medium text-[var(--color-brand-black)]">
              Klik atau drag & drop gambar
            </p>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              JPG, PNG, WebP, GIF
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <p className="text-sm font-medium">Mengupload...</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={handleChange}
      />

      {error && <p className="text-xs text-[var(--color-brand-red)]">{error}</p>}

      <p className="text-[10px] text-[var(--color-muted)]">
        Rekomendasi ukuran file: di bawah {MAX_WARN_MB}MB.{" "}
        <a
          href={COMPRESSOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--color-brand-black)]"
        >
          Kompress gambar di sini
        </a>
        .
      </p>
    </div>
  );
}
