import { Suspense } from "react";
import { getMarketData, type KomoditasItem, type BbmItem } from "@/lib/market";

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}rb`;
  return n.toString();
}

function Delta({ value, isPercent = false }: { value: number; isPercent?: boolean }) {
  if (Math.abs(value) < 0.001) return null;
  const up = value > 0;
  return (
    <span className={up ? "text-emerald-600" : "text-[var(--color-brand-red)]"}>
      {up ? "▲" : "▼"}&nbsp;
      {isPercent ? `${Math.abs(value).toFixed(2)}%` : Math.abs(value).toFixed(0)}
    </span>
  );
}

function Divider() {
  return <div className="w-px h-3 bg-[var(--color-border)] mx-1" />;
}

function BbmGroup({ items }: { items: BbmItem[] }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-bold uppercase tracking-[0.1em] text-[var(--color-muted)]">BBM</span>
      {items.map((item, i) => (
        <span key={item.name} className="flex items-center gap-1">
          {i > 0 && <span className="text-[var(--color-border)]">·</span>}
          <span className="text-[var(--color-muted)]">{item.name}</span>
          <span className="font-semibold">Rp{item.price.toLocaleString("id-ID")}</span>
        </span>
      ))}
    </div>
  );
}

function KomoditasGroup({ items }: { items: KomoditasItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="font-bold uppercase tracking-[0.1em] text-[var(--color-muted)]">Pangan</span>
      {items.map((item, i) => (
        <span key={item.name} className="flex items-center gap-1">
          {i > 0 && <span className="text-[var(--color-border)]">·</span>}
          <span className="text-[var(--color-muted)]">{item.name}</span>
          <span className="font-semibold">Rp{formatPrice(item.price)}/{item.unit}</span>
        </span>
      ))}
    </div>
  );
}

async function MarketData() {
  const data = await getMarketData();

  return (
    <div className="flex items-center gap-4 px-4 min-w-max">
      {data.ihsg && (
        <>
          <div className="flex items-center gap-1.5">
            <span className="font-bold uppercase tracking-[0.1em] text-[var(--color-muted)]">IHSG</span>
            <span className="font-semibold">
              {data.ihsg.value.toLocaleString("id-ID", { maximumFractionDigits: 2 })}
            </span>
            <Delta value={data.ihsg.changePercent} isPercent />
          </div>
          <Divider />
        </>
      )}

      {data.rupiah && (
        <>
          <div className="flex items-center gap-1.5">
            <span className="font-bold uppercase tracking-[0.1em] text-[var(--color-muted)]">USD/IDR</span>
            <span className="font-semibold">Rp{data.rupiah.value.toLocaleString("id-ID")}</span>
            <Delta value={data.rupiah.change} />
          </div>
          <Divider />
        </>
      )}

      <BbmGroup items={data.bbm} />

      {data.komoditas.length > 0 && (
        <>
          <Divider />
          <KomoditasGroup items={data.komoditas} />
        </>
      )}
    </div>
  );
}

export default function MarketStrip() {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-subtle)] overflow-x-auto scrollbar-none text-[10.5px]">
      <div className="py-1.5">
        <Suspense
          fallback={
            <div className="flex items-center px-4 text-[var(--color-muted)]">
              <span>Memuat data pasar&hellip;</span>
            </div>
          }
        >
          <MarketData />
        </Suspense>
      </div>
    </div>
  );
}
