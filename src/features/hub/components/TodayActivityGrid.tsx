import { Link } from "react-router-dom";
import type { GetTodaySnapshotOutput } from "../api/getTodaySnapshot";

type Props = {
  data: GetTodaySnapshotOutput | null;
  loading: boolean;
  error?: unknown;
};

export default function TodayActivityGrid({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-4 shadow">Loading activity...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-4 shadow">
        Unable to load today's activity.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl bg-white p-4 shadow">
        No activity data available yet.
      </div>
    );
  }

  const { activity } = data;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
      <StatCard
        label="Receives"
        value={activity.receiveCount}
        to="/ops/receive"
        helperText="Post received inventory"
      />
      <StatCard
        label="Moves"
        value={activity.moveCount}
        to="/ops/move"
        helperText="Transfer inventory"
      />
      <StatCard
        label="Adjustments"
        value={activity.adjustCount}
        to="/ops/adjust"
        helperText="Correct balances"
      />
      <StatCard
        label="Scans"
        value={activity.scanCount}
        to="/ops/receive"
        helperText="Resolve or create items"
      />
      <StatCard
        label="Quick Create"
        value={activity.quickCreateCount}
        to="/ops/receive"
        helperText="Add a new product"
      />
      <StatCard
        label="Sales"
        value={activity.saleCount}
        to="/view/products"
        helperText="Review affected products"
      />
      <StatCard
        label="Total"
        value={activity.totalCount}
        to="/view/products"
        helperText="Explore product activity"
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