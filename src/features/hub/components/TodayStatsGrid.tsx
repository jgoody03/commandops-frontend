import { Link } from "react-router-dom";
import type { GetTodaySnapshotOutput } from "../api/getTodaySnapshot";

type Props = {
  data: GetTodaySnapshotOutput | null;
  loading: boolean;
  error?: unknown;
};

export default function TodayStatsGrid({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-4 shadow">
        Loading snapshot...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-4 shadow">
        Unable to load today's snapshot.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl bg-white p-4 shadow">
        No snapshot data available yet.
      </div>
    );
  }

  const { totals } = data;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      <StatCard
        label="Products"
        value={totals.totalProducts}
        to="/view/products"
        helperText="Browse all products"
      />
      <StatCard label="Locations" value={totals.totalLocations} />
      <StatCard label="Units" value={totals.totalUnits} />
      <StatCard
        label="Low Stock"
        value={totals.lowStockProducts}
        to="/view/products?stockStatus=low"
        helperText="View low-stock products"
      />
      <StatCard
        label="Out of Stock"
        value={totals.outOfStockProducts}
        to="/view/products?stockStatus=out"
        helperText="View out-of-stock products"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  to,
  helperText,
}: {
  label: string;
  value: number;
  to?: string;
  helperText?: string;
}) {
  const content = (
    <div className="rounded-xl bg-white p-4 shadow transition hover:bg-slate-50">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
      {helperText ? (
        <div className="mt-2 text-sm font-medium text-blue-600">
          {helperText}
        </div>
      ) : null}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return content;
}