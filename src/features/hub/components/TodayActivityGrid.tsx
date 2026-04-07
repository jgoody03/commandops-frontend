import type { GetTodaySnapshotOutput } from "../api/getTodaySnapshot";

type Props = {
  data: GetTodaySnapshotOutput | null;
  loading: boolean;
  error?: unknown;
};

export default function TodayActivityGrid({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">Loading activity...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-rose-700">
          Unable to load today’s activity.
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">
          No activity data available yet.
        </div>
      </div>
    );
  }

  const { activity } = data;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Activity today
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Operational events recorded across your store today.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ActivityCard
          label="Total Activity"
          value={activity.totalCount}
          tone="primary"
        />
        <ActivityCard label="Receives" value={activity.receiveCount} />
        <ActivityCard label="Moves" value={activity.moveCount} />
        <ActivityCard label="Adjustments" value={activity.adjustCount} />
        <ActivityCard label="Scans" value={activity.scanCount} />
        <ActivityCard label="Quick Create" value={activity.quickCreateCount} />
        <ActivityCard label="Sales" value={activity.saleCount} />
      </div>
    </section>
  );
}

function ActivityCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "primary";
}) {
  const cardClass =
    tone === "primary"
      ? "border-slate-900 bg-slate-900 text-white"
      : "border-slate-200 bg-slate-50 text-slate-900";

  const labelClass =
    tone === "primary" ? "text-slate-300" : "text-slate-500";

  const valueClass =
    tone === "primary" ? "text-white" : "text-slate-900";

  return (
    <div
      className={`rounded-2xl border px-4 py-4 min-h-[96px] shadow-sm transition hover:shadow-md ${cardClass}`}
    >
      <div
        className={`text-[11px] font-semibold uppercase tracking-[0.12em] leading-4 break-words ${labelClass}`}
      >
        {label}
      </div>
      <div className={`mt-2 text-2xl font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}