# Bantargebang Daily — Dokumentasi Proyek

> **Reminder:** Setiap kali selesai build sesuatu, langsung centang item yang selesai di bagian "Yang Belum Dibuat" / "Backlog Tambahan", dan update bagian yang relevan jika ada perubahan struktur. Dokumentasi yang tidak sinkron dengan kode lebih berbahaya dari tidak ada dokumentasi.

## Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS 4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + `@supabase/ssr` |
| Storage | Supabase Storage (bucket: `bantargebang-daily`) |
| Hosting | Vercel |
| Editor | TipTap |

---

## Struktur Database

### Tabel `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigserial | Primary key |
| name | text | Nama lengkap |
| email | text | Unique, harus sama dengan Supabase Auth |
| password_hash | text | Diisi `-` (auth ditangani Supabase) |
| role | text | `writer` / `editor` / `admin` |
| avatar_url | text | URL foto profil (Supabase Storage) |
| bio | text | Deskripsi singkat penulis |
| created_at | timestamptz | |

### Tabel `articles`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigserial | Primary key |
| title | text | |
| slug | text | Unique, URL-friendly |
| content | text | HTML dari TipTap |
| excerpt | text | Ringkasan untuk homepage & SEO |
| thumbnail_url | text | Nullable |
| author_id | bigint | FK → users.id |
| category_id | bigint | FK → categories.id |
| status | text | `draft` / `review` / `published` |
| is_featured | boolean | Tampil di featured section |
| published_at | timestamptz | Di-set saat pertama publish |
| created_at | timestamptz | |

### Tabel lainnya
- `categories` — id, name, slug
- `tags`, `article_tags` — tagging artikel (belum dipakai di UI)
- `article_metrics` — views, unique_views, avg_read_time, bounce_rate
- `events` — raw event log untuk analytics

---

## Struktur File

```
src/
├── app/
│   ├── page.tsx                        # Homepage (featured + latest articles)
│   ├── sitemap.ts                      # Auto sitemap
│   ├── robots.ts                       # robots.txt
│   ├── globals.css                     # Tailwind theme + prose-article + tiptap styles
│   ├── layout.tsx                      # Root layout (font, metadata)
│   │
│   ├── berita/[slug]/page.tsx          # Halaman artikel publik + author card
│   ├── kategori/[slug]/page.tsx        # Halaman kategori
│   │
│   ├── admin/
│   │   ├── login/page.tsx              # Halaman login
│   │   └── (protected)/               # Route group — dilindungi proxy.ts
│   │       ├── layout.tsx             # Layout admin (sidebar + main)
│   │       ├── page.tsx               # Dashboard admin
│   │       ├── articles/
│   │       │   ├── page.tsx           # Daftar artikel (filter by author untuk writer)
│   │       │   ├── new/page.tsx       # Tulis artikel baru
│   │       │   └── [id]/page.tsx      # Edit artikel
│   │       └── users/                 # Admin only
│   │           ├── page.tsx           # Daftar pengguna
│   │           ├── new/page.tsx       # Tambah pengguna
│   │           └── [id]/page.tsx      # Edit profil pengguna
│   │
│   ├── actions/
│   │   ├── auth.ts                    # loginAction, logout
│   │   ├── articles.ts                # createArticle, updateArticle, deleteArticle
│   │   └── users.ts                   # createUser, updateUser, deleteUser
│   │
│   └── api/
│       ├── upload/route.ts            # Image upload ke Supabase Storage
│       └── views/route.ts             # View counter (increment_article_views RPC)
│
├── components/
│   ├── Header.tsx                     # Navigasi publik
│   ├── Footer.tsx
│   ├── ArticleCard.tsx                # Card artikel (variant: default, side, featured)
│   ├── ViewTracker.tsx                # Client component, kirim view event
│   └── admin/
│       ├── AdminSidebar.tsx           # Sidebar role-aware
│       ├── ArticleForm.tsx            # Form tulis/edit artikel
│       ├── RichEditor.tsx             # TipTap WYSIWYG editor
│       ├── ImageUpload.tsx            # Upload gambar + warning kompresi
│       ├── UserForm.tsx               # Form tambah/edit pengguna
│       ├── DeleteArticleButton.tsx    # Client component delete artikel
│       └── DeleteUserButton.tsx       # Client component delete pengguna
│
└── lib/
    ├── types.ts                       # TypeScript interfaces (Article, Author, UserProfile, dll)
    ├── queries.ts                     # Fungsi query Supabase untuk halaman publik
    ├── dal.ts                         # verifySession() — auth gate server-side
    ├── utils.ts                       # formatDate, estimateReadTime, dll
    ├── supabase.ts                    # Anon client (publik)
    ├── supabase-server.ts             # Server client (cookie-based, untuk auth)
    ├── supabase-browser.ts            # Browser client
    └── supabase-admin.ts              # Service role client (untuk manajemen user)
```

---

## Sistem Role

| Role | Label UI | Akses |
|---|---|---|
| `admin` | Admin | Dashboard, semua artikel, kelola pengguna, publish, featured |
| `editor` | Editor | Dashboard, semua artikel, publish, featured |
| `writer` | Jurnalis | Artikel milik sendiri saja, status max `review` |

Enforcement dilakukan di dua lapis: UI (form, sidebar, filter) **dan** server action (role check sebelum DB write).

---

## Auth Flow

1. **Proxy** (`src/proxy.ts`) — intercept semua request `/admin/*`, cek session dari cookie (no network call). Redirect ke login jika tidak ada session.
2. **Layout** (`(protected)/layout.tsx`) — panggil `verifySession()` yang verify user via Supabase Auth network call.
3. **`verifySession()`** — di-cache dengan React `cache()`, query tabel `users` untuk nama + role. Fallback ke email sebagai nama dan role `admin` jika tabel tidak terbaca.

---

## Image Upload

- File dikirim ke `/api/upload` (server-side) bukan langsung dari browser ke Supabase.
- Disimpan di bucket `bantargebang-daily` (public read).
- Jika file > 1MB, tampil banner warning dengan link ke tools kompresi: https://ganbaro.vercel.app/file-compressor

---

## Halaman Publik

| URL | Keterangan |
|---|---|
| `/` | Homepage: artikel featured + terbaru |
| `/berita/[slug]` | Halaman artikel + author card + related articles |
| `/kategori/[slug]` | Daftar artikel per kategori |

---

## Environment Variables

| Variabel | Keterangan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key |
| `NEXT_PUBLIC_SITE_URL` | URL site (untuk redirect) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — hanya server, untuk create/delete auth user |

---

## Yang Belum Dibuat

### Prioritas Tinggi
- [x] **Halaman profil / dashboard jurnalis & editor** — saat ini `/admin` selalu menampilkan analytics (khusus admin). Untuk jurnalis dan editor, halaman `/admin` perlu diganti menjadi halaman profil mereka sendiri (ubah nama, foto, bio, password). Admin tetap mendapat analytics dashboard. Untuk ganti password: user harus input password lama terlebih dahulu, diverifikasi via `signInWithPassword`, baru kemudian `updateUser({ password: baru })` dijalankan.
- [x] **Analytics dashboard** — tampilkan views, unique views per artikel di halaman `/admin`. Data sudah ada di tabel `article_metrics` dan `events`.
- [x] **Halaman review artikel** — antrian artikel berstatus `review` untuk di-approve/publish oleh editor/admin tanpa harus masuk ke form edit.
- [x] **Error handling UI** — form server actions saat ini hanya `console.error` / `redirect`. Perlu tampilkan pesan error di form jika gagal (gunakan `useActionState`).

- [x] **Suspend akun** — nonaktifkan akun jurnalis/editor sementara tanpa menghapus data. Implementasi: tambah kolom `is_active boolean default true` di tabel `users`, cek di `verifySession()` — kalau `false` redirect ke login. Admin bisa toggle dari `/admin/users`.

### Prioritas Menengah
- [x] **Sistem tag** — tabel `tags` dan `article_tags` sudah ada di DB tapi belum ada UI di form artikel dan belum di-query di halaman publik.
- [x] **Pencarian artikel** — search bar di header, query ke Supabase (`ilike` pada title + excerpt), halaman `/cari?q=...`.
- [x] **Pagination** — page-based pagination di homepage (`/?page=N`) dan kategori (`/kategori/[slug]?page=N`), 12 artikel per halaman.
- [x] **Halaman profil penulis** — `/penulis/[id]` menampilkan foto, bio, dan semua artikel published oleh jurnalis tersebut. Author card di halaman artikel di-link ke halaman ini.

### Prioritas Rendah / Future
- [ ] **Email notifikasi** — notif ke editor ketika artikel masuk status `review`.
- [ ] **SEO lanjutan** — structured data untuk kategori, canonical URL, sitemap dinamis per kategori.
- [ ] **Dark mode** — variabel CSS sudah siap di globals.css, tinggal tambah `prefers-color-scheme`.
- [ ] **Komentar** — bisa pakai Supabase Realtime atau third-party (Disqus/Giscus).
- [ ] **Redis cache + Elasticsearch** — untuk traffic tinggi (disebutkan sebagai "Stage 2").

---

## Backlog Tambahan

### UX & Operasional
- [x] **Lupa password** — `/admin/forgot-password` kirim email reset via `resetPasswordForEmail()`. `/admin/reset-password` exchange code + update password via browser client. Login page ada link "Lupa password?".
- [x] **Auto-save draft** — `ArticleForm` auto-save ke localStorage (debounced 1.5s). Banner kuning muncul saat ada draft tersimpan dengan opsi Pulihkan / Abaikan. Draft dihapus otomatis saat form di-submit.
- [ ] **Jadwal publish** — tambah field `scheduled_at` di tabel `articles`, artikel otomatis tayang di waktu yang ditentukan via cron job (bisa pakai Vercel Cron).

### Fitur Publik
- [x] **Tombol share** — `ShareButtons` component di halaman artikel. Ada WA, X, Facebook. URL diambil dari `window.location.href` (client-side).
- [ ] **Breaking news ticker** — banner/ticker di header untuk berita mendesak. Bisa tambah field `is_breaking` di tabel `articles` atau tabel terpisah.
- [ ] **Halaman profil penulis publik** — `/penulis/[id]` menampilkan foto, bio, dan semua artikel yang sudah dipublish oleh jurnalis tersebut. Author card di halaman artikel perlu di-link ke halaman ini.

### Teknikal
- [ ] **Deployment checklist Vercel** — dokumentasi env variables yang perlu di-set di Vercel dashboard, konfigurasi domain Supabase Storage agar `next/image` bisa render gambar dari bucket.
- [ ] **Rate limiting** — batasi request ke `/api/upload` dan `/api/views` untuk mencegah abuse. Bisa pakai Vercel Edge middleware atau library `upstash/ratelimit`.
