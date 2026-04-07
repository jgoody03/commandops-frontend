import { useMemo } from "react";
import type { GetTodaySnapshotOutput } from "../api/getTodaySnapshot";

type Props = {
  data: GetTodaySnapshotOutput | null;
  loading: boolean;
  error?: unknown;
};

export default function SalesSparklineCard({ data, loading, error }: Props) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">Loading sales signal...</div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Sales signal
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Sales trend is not available yet.
        </div>
      </section>
    );
  }

  const sales = data.sales ?? {
    salesTodayCount: 0,
    unitsSoldToday: 0,
    salesTodayRevenue: 0,
  };

  const points = useMemo(() => {
    const revenue = sales.salesTodayRevenue;
    const units = sales.unitsSoldToday;
    const tx = sales.salesTodayCount;

    if (revenue <= 0 && units <= 0 && tx <= 0) {
      return [16, 16, 16, 16, 16, 16, 16, 16];
    }

    const seed = [
      Math.max(8, tx * 3),
      Math.max(10, units * 2),
      Math.max(12, revenue * 0.04),
      Math.max(14, tx * 4),
      Math.max(16, units * 2.5),
      Math.max(18, revenue * 0.05),
      Math.max(20, tx * 5),
      Math.max(22, units * 3),
    ];

    const max = Math.max(...seed, 1);
    return seed.map((value) => {
      const normalized = 14 + (value / max) * 42;
      return Number(normalized.toFixed(1));
    });
  }, [sales.salesTodayCount, sales.salesTodayRevenue, sales.unitsSoldToday]);

  const polyline = points
    .map((y, index) => `${index * 42},${70 - y}`)
    .join(" ");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
            </span>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Sales signal
            </div>
          </div>

          <div className="mt-2 text-2xl font-semibold text-slate-900">
            ${sales.salesTodayRevenue.toFixed(2)}
          </div>

          <div className="mt-1 text-sm text-slate-600">
            {sales.unitsSoldToday} units sold across {sales.salesTodayCount} transaction
            {sales.salesTodayCount === 1 ? "" : "s"} today.
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <svg
          viewBox="0 0 294 80"
          className="h-20 w-full overflow-visible"
          aria-label="Sales sparkline"
        >
          <defs>
            <linearGradient id="salesPulseLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>

          <path
            d="M0 70 H294"
            stroke="#e2e8f0"
            strokeWidth="1"
            fill="none"
          />

          <polyline
            fill="none"
            stroke="url(#salesPulseLine)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polyline}
            className="drop-shadow-[0_0_6px_rgba(14,165,233,0.18)]"
          />

          {points.map((y, index) => (
            <circle
              key={index}
              cx={index * 42}
              cy={70 - y}
              r="3.5"
              fill="#0ea5e9"
            />
          ))}
        </svg>

        <div className="mt-2 text-xs text-slate-500">
          Live sales pulse. Later this can become a true hourly sales trend.
        </div>
      </div>
    </section>
  );
}