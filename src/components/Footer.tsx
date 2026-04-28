import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t-2 border-[var(--color-brand-black)] bg-[var(--color-brand-black)] text-white">
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Bantargebang Times
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Media berita lokal yang menyajikan informasi terkini seputar
              Bantargebang dan wilayah sekitarnya.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4 text-gray-300">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm">
              {["Beranda", "Lokal", "Nasional", "Ekonomi", "Olahraga"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Beranda" ? "/" : `/kategori/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4 text-gray-300">
              Tentang
            </h3>
            <ul className="space-y-2.5 text-sm">
              {["Tentang Kami", "Redaksi", "Pedoman Media Siber", "Kontak"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© {year} Bantargebang Times. Seluruh hak cipta dilindungi.</p>
          <p className="text-gray-700">Bantargebang, Bekasi</p>
        </div>
      </div>
    </footer>
  );
}
