-- ============================================================
-- Bantargebang Daily — Seed Data
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- Admin user (password hash adalah placeholder, ganti via dashboard nanti)
insert into users (name, email, password_hash, role) values
  ('Redaksi Bantargebang Daily', 'redaksi@bantargebangdaily.com', 'placeholder', 'admin'),
  ('Andi Setiawan', 'andi@bantargebangdaily.com', 'placeholder', 'writer'),
  ('Sari Rahayu', 'sari@bantargebangdaily.com', 'placeholder', 'writer')
on conflict (email) do nothing;

-- Articles
insert into articles (title, slug, content, excerpt, thumbnail_url, author_id, category_id, status, is_featured, published_at)
values

-- LOKAL (category id 1)
(
  'Pasar Bantargebang Akan Direnovasi, Pedagang Minta Relokasi Sementara',
  'pasar-bantargebang-akan-direnovasi',
  '<p>Pemerintah Kota Bekasi resmi mengumumkan rencana renovasi besar-besaran Pasar Bantargebang yang dijadwalkan dimulai pada bulan depan. Proyek senilai Rp 12 miliar ini ditargetkan selesai dalam delapan bulan ke depan.</p><p>Kepala Dinas Perdagangan Kota Bekasi, Budi Santoso, menyatakan bahwa renovasi ini bertujuan untuk meningkatkan kenyamanan pedagang dan pembeli. "Kita ingin Pasar Bantargebang menjadi pasar modern yang tetap terjangkau," ujarnya dalam konferensi pers, Senin (21/4).</p><p>Ratusan pedagang yang berjualan di pasar tersebut meminta pemerintah menyediakan lokasi relokasi sementara yang layak selama proses renovasi berlangsung. Ketua Paguyuban Pedagang Pasar Bantargebang, Hendra Wijaya, mengatakan pihaknya siap berkoordinasi asalkan relokasi tidak merugikan omzet pedagang.</p><p>"Kami mendukung renovasi, tapi tolong jangan sampai kami kehilangan pelanggan selama delapan bulan," kata Hendra.</p><p>Dinas Perdagangan menjanjikan akan menyiapkan tenda-tenda di area parkir sebagai solusi sementara.</p>',
  'Pemerintah Kota Bekasi umumkan renovasi Pasar Bantargebang senilai Rp 12 miliar. Pedagang minta relokasi sementara yang layak.',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
  2, 1, 'published', true,
  now() - interval '2 hours'
),

(
  'Jalan Protokol Bantargebang Akhirnya Diperbaiki Setelah Setahun Rusak',
  'jalan-protokol-bantargebang-diperbaiki',
  '<p>Warga Bantargebang akhirnya bisa bernapas lega. Jalan protokol sepanjang 2,3 kilometer yang sudah rusak parah selama hampir setahun mulai diperbaiki hari ini oleh Dinas Bina Marga Kota Bekasi.</p><p>Pengerjaan dijadwalkan berlangsung selama 30 hari dan diharapkan rampung sebelum bulan Mei. Selama proses perbaikan, arus lalu lintas akan dialihkan melalui jalan alternatif.</p><p>Warga setempat menyambut gembira perbaikan ini. "Sudah lama kami tunggu, lubang-lubang di jalan ini sudah bikin banyak kecelakaan," ujar Ibu Tini, warga RT 05.</p>',
  'Jalan protokol Bantargebang sepanjang 2,3 km mulai diperbaiki setelah rusak hampir setahun. Pengerjaan ditargetkan 30 hari.',
  'https://images.unsplash.com/photo-1581094794329-c8112c4e5190?w=800&q=80',
  3, 1, 'published', false,
  now() - interval '5 hours'
),

(
  'Posyandu RW 08 Bantargebang Raih Penghargaan Terbaik se-Kota Bekasi',
  'posyandu-rw08-bantargebang-raih-penghargaan',
  '<p>Posyandu RW 08 Kelurahan Bantargebang berhasil meraih penghargaan Posyandu Terbaik tingkat Kota Bekasi tahun 2026. Penghargaan diserahkan langsung oleh Wali Kota Bekasi dalam upacara peringatan Hari Kesehatan Nasional.</p><p>Keberhasilan ini tidak lepas dari dedikasi para kader posyandu yang aktif melakukan pendampingan gizi balita dan ibu hamil. Selama dua tahun terakhir, angka stunting di wilayah ini berhasil ditekan hingga 40 persen.</p><p>Ketua kader posyandu, Ibu Dewi Astuti, mengatakan keberhasilan ini adalah buah kerja keras bersama. "Ini bukan prestasi saya sendiri, tapi prestasi seluruh warga RW 08," tuturnya dengan bangga.</p>',
  'Posyandu RW 08 Bantargebang raih penghargaan terbaik se-Kota Bekasi berkat keberhasilan menekan angka stunting hingga 40 persen.',
  'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80',
  2, 1, 'published', true,
  now() - interval '1 day'
),

-- LINGKUNGAN (category id 6)
(
  'Volume Sampah TPST Bantargebang Turun 8 Persen, DLH Klaim Hasil Program Pilah Sampah',
  'volume-sampah-tpst-turun-8-persen',
  '<p>Dinas Lingkungan Hidup (DLH) Kota Bekasi mencatat penurunan volume sampah yang masuk ke Tempat Pengolahan Sampah Terpadu (TPST) Bantargebang sebesar 8 persen dalam kuartal pertama 2026 dibandingkan periode yang sama tahun lalu.</p><p>Kepala DLH Kota Bekasi, Ir. Rahmat Hidayat, menyatakan penurunan ini merupakan hasil dari program Pilah Sampah dari Rumah yang sudah berjalan selama 18 bulan. "Masyarakat mulai sadar bahwa sampah organik bisa diolah menjadi kompos," kata Rahmat.</p><p>Meski demikian, total sampah harian yang masuk ke TPST Bantargebang masih mencapai rata-rata 7.800 ton per hari, jauh melampaui kapasitas desain fasilitas tersebut.</p><p>Aktivis lingkungan dari Komunitas Peduli Bantargebang, Fauzi Rahman, menilai penurunan 8 persen belum cukup signifikan. "Kita butuh terobosan yang lebih besar, bukan sekadar program sosialisasi," ujarnya.</p>',
  'DLH Kota Bekasi catat penurunan 8 persen volume sampah di TPST Bantargebang. Namun aktivis nilai angka ini belum cukup.',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
  2, 6, 'published', true,
  now() - interval '3 hours'
),

(
  'Komunitas Hijau Bantargebang Tanam 500 Pohon di Lahan Kritis',
  'komunitas-hijau-bantargebang-tanam-500-pohon',
  '<p>Komunitas Hijau Bantargebang bersama ratusan sukarelawan dari berbagai kalangan melakukan aksi penanaman 500 pohon di lahan kritis sekitar kawasan TPST Bantargebang, Minggu (20/4) kemarin.</p><p>Kegiatan yang bertepatan dengan peringatan Hari Bumi ini merupakan bagian dari program jangka panjang untuk mengembalikan tutupan hijau di area yang selama ini terimbas polusi dari tempat pengolahan sampah terbesar di Asia Tenggara tersebut.</p><p>Jenis pohon yang ditanam antara lain trembesi, mahoni, dan ketapang kencana yang dikenal mampu menyerap polutan udara secara efektif.</p>',
  'Komunitas Hijau Bantargebang tanam 500 pohon di lahan kritis bertepatan Hari Bumi. Upaya mengembalikan tutupan hijau di sekitar TPST.',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
  3, 6, 'published', false,
  now() - interval '20 hours'
),

-- EKONOMI (category id 3)
(
  'UMKM Daur Ulang Bantargebang Tembus Pasar Ekspor ke Jepang',
  'umkm-daur-ulang-bantargebang-ekspor-jepang',
  '<p>Sebuah usaha kecil menengah (UMKM) dari Bantargebang berhasil menembus pasar ekspor dengan mengirimkan produk kerajinan daur ulang ke Jepang senilai Rp 800 juta pada kuartal pertama 2026.</p><p>CV Kreasi Hijau Nusantara, yang didirikan oleh pasangan suami istri asal Bantargebang, memproduksi berbagai kerajinan tangan dari bahan sampah plastik dan logam bekas yang diolah menjadi produk bernilai tinggi.</p><p>"Ini membuktikan bahwa sampah bisa menjadi berkah jika dikelola dengan kreativitas," kata Direktur CV Kreasi Hijau, Bpk. Surya Dinata, saat ditemui di workshop miliknya.</p><p>Keberhasilan ini mendapat perhatian Dinas Koperasi dan UMKM Kota Bekasi, yang berencana menjadikan CV Kreasi Hijau sebagai model pengembangan UMKM berbasis ekonomi sirkular.</p>',
  'CV Kreasi Hijau dari Bantargebang ekspor kerajinan daur ulang ke Jepang senilai Rp 800 juta. Bukti sampah bisa jadi berkah.',
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
  2, 3, 'published', true,
  now() - interval '6 hours'
),

(
  'Harga Cabai di Pasar Bantargebang Meroket, Pedagang Sayur Mengeluh',
  'harga-cabai-pasar-bantargebang-meroket',
  '<p>Harga cabai rawit di Pasar Bantargebang melonjak drastis dalam dua pekan terakhir, dari Rp 45.000 menjadi Rp 85.000 per kilogram. Kenaikan ini membuat pedagang sayur dan pembeli sama-sama mengeluh.</p><p>Pedagang sayur, Ibu Lastri, mengatakan kenaikan harga cabai membuat dagangannya sepi pembeli. "Banyak yang langsung putar balik begitu dengar harganya," keluhnya.</p><p>Dinas Perdagangan setempat menyebut kenaikan ini dipicu oleh berkurangnya pasokan dari sentra produksi di Jawa Tengah akibat cuaca ekstrem beberapa waktu lalu. Operasi pasar murah direncanakan digelar pekan depan.</p>',
  'Harga cabai rawit di Pasar Bantargebang tembus Rp 85.000 per kg. Operasi pasar murah direncanakan pekan depan.',
  'https://images.unsplash.com/photo-1563591921-b57ac3e9edd7?w=800&q=80',
  3, 3, 'published', false,
  now() - interval '8 hours'
),

-- NASIONAL (category id 2)
(
  'Bekasi Masuk 10 Kota Terbaik Pengelolaan Lingkungan Versi Kemendagri',
  'bekasi-10-kota-terbaik-pengelolaan-lingkungan',
  '<p>Kota Bekasi masuk dalam daftar 10 kota terbaik dalam pengelolaan lingkungan hidup versi Kementerian Dalam Negeri tahun 2026. Penilaian mencakup pengelolaan sampah, kualitas udara, dan program penghijauan kota.</p><p>Menteri Dalam Negeri menyerahkan penghargaan tersebut dalam acara Rakornas Lingkungan Hidup di Jakarta, Kamis (18/4) lalu. Wali Kota Bekasi hadir langsung untuk menerima penghargaan ini.</p><p>"Ini motivasi kami untuk terus meningkatkan kualitas lingkungan, khususnya di kawasan TPST Bantargebang," ujar Wali Kota Bekasi dalam sambutannya.</p>',
  'Kota Bekasi masuk 10 besar kota terbaik pengelolaan lingkungan versi Kemendagri 2026. TPST Bantargebang jadi sorotan.',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
  2, 2, 'published', false,
  now() - interval '2 days'
),

-- OLAHRAGA (category id 4)
(
  'Turnamen Sepak Bola Antar-RW Bantargebang 2026 Resmi Dibuka',
  'turnamen-sepak-bola-antar-rw-bantargebang-2026',
  '<p>Turnamen sepak bola antar-RW Bantargebang 2026 resmi dibuka di Lapangan Persada, Sabtu (19/4) malam. Sebanyak 24 tim dari 12 RW di Kelurahan Bantargebang dan sekitarnya ambil bagian dalam turnamen yang berhadiah total Rp 30 juta ini.</p><p>Ketua panitia, Pak Agus Budi, mengatakan antusias warga tahun ini meningkat signifikan dibandingkan tahun sebelumnya. "Tahun lalu hanya 16 tim, sekarang sudah 24. Ini menunjukkan semangat olahraga warga Bantargebang semakin tinggi," ujarnya.</p><p>Turnamen akan berlangsung selama tiga pekan dengan sistem gugur dan dijadwalkan final pada 10 Mei mendatang.</p>',
  'Turnamen sepak bola antar-RW Bantargebang 2026 dibuka dengan 24 tim peserta. Total hadiah Rp 30 juta diperebutkan.',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  3, 4, 'published', false,
  now() - interval '1 day'
),

-- HIBURAN (category id 5)
(
  'Festival Kuliner Bantargebang Hadir Lagi, 50 Stan Siap Manjakan Lidah',
  'festival-kuliner-bantargebang-2026',
  '<p>Festival Kuliner Bantargebang kembali hadir setelah absen dua tahun. Tahun ini festival digelar di alun-alun Kecamatan Bantargebang selama tiga hari, mulai 25 hingga 27 April 2026.</p><p>Sebanyak 50 stan kuliner akan memeriahkan festival, menyajikan aneka masakan Nusantara hingga makanan kekinian. Panitia juga menyiapkan panggung hiburan dengan penampilan artis lokal setiap malamnya.</p><p>"Kami ingin festival ini menjadi ruang kreativitas warga sekaligus menggerakkan ekonomi lokal," kata Camat Bantargebang, Bpk. Darmawan.</p><p>Tiket masuk festival gratis untuk umum. Pengunjung cukup membeli voucher makanan senilai Rp 25.000 sebagai syarat masuk.</p>',
  'Festival Kuliner Bantargebang hadir kembali 25-27 April 2026. 50 stan kuliner dan hiburan artis lokal setiap malam.',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  3, 5, 'published', false,
  now() - interval '4 hours'
);

-- Seed article_metrics
insert into article_metrics (article_id, views, unique_views, avg_read_time)
select id,
  floor(random() * 2000 + 100)::bigint,
  floor(random() * 1500 + 80)::bigint,
  round((random() * 3 + 1)::numeric, 2)
from articles
where status = 'published'
on conflict (article_id) do nothing;
