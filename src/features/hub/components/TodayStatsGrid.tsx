import type { GetTodaySnapshotOutput } from "../api/getTodaySnapshot";

type Props = {
  data: GetTodaySnapshotOutput | null;
  loading: boolean;
  error?: unknown;
};

export default function TodayStatsGrid({ data, loading, error }: Props) {
  if (loading) {
    return <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">Loading snapshot...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
        Unable to load today's snapshot.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
        No snapshot data available yet.
      </div>
    );
  }

  const { totals } = data;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      <StatCard label="Products" value={totals.totalProducts} />
      <StatCard label="Locations" value={totals.totalLocations} />
      <StatCard label="Units" value={totals.totalUnits} />
      <StatCard label="Low Stock" value={totals.lowStockProducts} />
      <StatCard label="Out of Stock" value={totals.outOfStockProducts} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70 transition hover:shadow-md">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}