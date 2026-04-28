import { unstable_cache } from "next/cache";

export type IhsgData = {
  value: number;
  change: number;
  changePercent: number;
};

export type RupiahData = {
  value: number;
  change: number;
};

export type BbmItem = {
  name: string;
  price: number;
};

export type KomoditasItem = {
  name: string;
  price: number;
  unit: string;
};

export type MarketData = {
  ihsg: IhsgData | null;
  rupiah: RupiahData | null;
  bbm: BbmItem[];
  komoditas: KomoditasItem[];
};

// Update manually when Pertamina changes prices
export const BBM_PRICES: BbmItem[] = [
  { name: "Pertalite", price: 10000 },
  { name: "Pertamax", price: 12500 },
  { name: "Solar", price: 6800 },
];

async function fetchYahooChart(
  symbol: string
): Promise<{ price: number; prevClose: number } | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta?.regularMarketPrice) return null;
    return {
      price: meta.regularMarketPrice,
      prevClose: meta.previousClose ?? meta.chartPreviousClose ?? meta.regularMarketPrice,
    };
  } catch {
    return null;
  }
}

const PIHPS_TARGETS: { key: string; name: string; unit: string }[] = [
  { key: "beras medium", name: "Beras", unit: "kg" },
  { key: "minyak goreng", name: "Minyak Goreng", unit: "L" },
  { key: "gula pasir", name: "Gula", unit: "kg" },
  { key: "cabai merah keriting", name: "Cabai", unit: "kg" },
  { key: "daging ayam ras", name: "Ayam", unit: "kg" },
  { key: "telur ayam ras", name: "Telur", unit: "kg" },
];

async function fetchPihps(): Promise<KomoditasItem[]> {
  try {
    const res = await fetch("https://hargapangan.id/tabel-harga/pasar-modern/daerah", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
      },
    });
    if (!res.ok) return [];
    const html = await res.text();

    const results: KomoditasItem[] = [];
    // Split by table rows and search each for commodity names + prices
    const rows = html.split(/<tr[\s>]/i);

    for (const row of rows) {
      const plain = row.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").toLowerCase().trim();
      for (const target of PIHPS_TARGETS) {
        if (results.find((r) => r.name === target.name)) continue;
        if (!plain.includes(target.key)) continue;
        // Match prices: 4–6 digit numbers, optionally formatted with dots/commas
        const matches = [...plain.matchAll(/\b(\d{1,3}(?:[.,]\d{3})+|\d{4,6})\b/g)];
        for (const m of matches) {
          const price = parseInt(m[1].replace(/[.,]/g, ""), 10);
          if (price >= 2000 && price <= 500000) {
            results.push({ name: target.name, price, unit: target.unit });
            break;
          }
        }
      }
    }

    return results;
  } catch {
    return [];
  }
}

const getCachedIhsg = unstable_cache(
  () => fetchYahooChart("^JKSE"),
  ["market-ihsg"],
  { revalidate: 300 }
);

const getCachedRupiah = unstable_cache(
  () => fetchYahooChart("USDIDR=X"),
  ["market-rupiah"],
  { revalidate: 300 }
);

const getCachedKomoditas = unstable_cache(fetchPihps, ["market-komoditas"], {
  revalidate: 3600,
});

export async function getMarketData(): Promise<MarketData> {
  const [ihsgRaw, rupiahRaw, komoditas] = await Promise.all([
    getCachedIhsg(),
    getCachedRupiah(),
    getCachedKomoditas(),
  ]);

  return {
    ihsg: ihsgRaw
      ? {
          value: ihsgRaw.price,
          change: ihsgRaw.price - ihsgRaw.prevClose,
          changePercent: ((ihsgRaw.price - ihsgRaw.prevClose) / ihsgRaw.prevClose) * 100,
        }
      : null,
    rupiah: rupiahRaw
      ? {
          value: Math.round(rupiahRaw.price),
          change: rupiahRaw.price - rupiahRaw.prevClose,
        }
      : null,
    bbm: BBM_PRICES,
    komoditas,
  };
}
