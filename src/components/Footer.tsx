import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t-2 border-[var(--color-brand-black)] bg-[var(--color-brand-black)] text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Bantargebang Daily
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Media berita lokal yang menyajikan informasi terkini seputar
              Bantargebang dan wilayah sekitarnya.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-3 text-gray-400">
              Navigasi
            </h3>
            <ul className="space-y-2 text-sm">
              {["Beranda", "Lokal", "Nasional", "Ekonomi", "Olahraga"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={item === "Beranda" ? "/" : `/kategori/${item.toLowerCase()}`}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-3 text-gray-400">
              Tentang
            </h3>
            <ul className="space-y-2 text-sm">
              {["Tentang Kami", "Redaksi", "Pedoman Media Siber", "Kontak"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {year} Bantargebang Daily. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
