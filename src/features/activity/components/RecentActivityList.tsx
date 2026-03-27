import type { GetTodaySnapshotOutput } from "@/features/hub/api/getTodaySnapshot";

type Props = {
  data: GetTodaySnapshotOutput | null;
  loading: boolean;
  error?: unknown;
};

function formatTimestamp(ms: number | null) {
  if (!ms) return "Unknown time";
  return new Date(ms).toLocaleString();
}

export default function RecentActivityList({ data, loading, error }: Props) {
  if (loading) {
    return <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">Loading recent activity...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
        Unable to load recent activity.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        <p className="mt-2 text-sm text-slate-500">No recent activity available yet.</p>
      </div>
    );
  }

  if (!data.recentActivity.length) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        <p className="mt-2 text-sm text-slate-500">No recent activity yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
      <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>

      <div className="mt-4 space-y-3">
        {data.recentActivity.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 px-4 py-3 transition hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium text-slate-900">{item.title}</div>
                {item.subtitle ? (
                  <div className="mt-1 text-sm text-slate-500">{item.subtitle}</div>
                ) : null}
              </div>

              <div className="shrink-0 text-xs text-slate-400">
                {formatTimestamp(item.createdAtMs)}
              </div>
            </div>

            <div className="mt-2 text-xs uppercase tracking-wide text-slate-400">
              {item.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}