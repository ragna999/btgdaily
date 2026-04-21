-- ============================================================
-- Auth Setup: buat user admin pertama di Supabase
-- Jalankan SETELAH buat akun via Authentication > Users di Dashboard
-- ============================================================

-- Pastikan user admin sudah ada di tabel users dengan email yang sama
-- dengan yang didaftarkan di Supabase Authentication dashboard.
-- Kalau belum ada, insert manual:

-- Ganti email di bawah dengan email yang kamu daftarkan di Supabase Auth
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@bantargebangdaily.com', '-', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- RLS policy agar admin bisa baca/tulis semua artikel
CREATE POLICY "admin full access articles"
  ON articles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE email = auth.jwt() ->> 'email'
      AND role IN ('admin', 'editor', 'writer')
    )
  );

-- RLS policy agar writer bisa insert artikel
CREATE POLICY "writer insert articles"
  ON articles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE email = auth.jwt() ->> 'email'
      AND role IN ('admin', 'editor', 'writer')
    )
  );
