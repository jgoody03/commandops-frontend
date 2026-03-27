import type { GetTodaySnapshotOutput } from "../api/getTodaySnapshot";

type Props = {
  data: GetTodaySnapshotOutput | null;
  loading: boolean;
  error?: unknown;
};

export default function TodayActivityGrid({ data, loading, error }: Props) {
  if (loading) {
    return <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">Loading activity...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
        Unable to load today's activity.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
        No activity data available yet.
      </div>
    );
  }

  const { activity } = data;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
      <StatCard label="Receives" value={activity.receiveCount} />
      <StatCard label="Moves" value={activity.moveCount} />
      <StatCard label="Adjustments" value={activity.adjustCount} />
      <StatCard label="Scans" value={activity.scanCount} />
      <StatCard label="Quick Create" value={activity.quickCreateCount} />
      <StatCard label="Sales" value={activity.saleCount} />
      <StatCard label="Total" value={activity.totalCount} />
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