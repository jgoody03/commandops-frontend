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

function typeLabel(type: string) {
  switch (type) {
    case "receive":
      return "Receive";
    case "move":
      return "Move";
    case "adjust":
      return "Adjust";
    case "scan":
      return "Scan";
    case "quick_create":
      return "Quick Create";
    case "sale":
      return "Sale";
    default:
      return type;
  }
}

function typeBadgeClass(type: string) {
  switch (type) {
    case "sale":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "receive":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "move":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "adjust":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "scan":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "quick_create":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default function RecentActivityList({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-slate-500">Loading recent activity...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-rose-700">
          Unable to load recent activity.
        </div>
      </div>
    );
  }

  if (!data || !data.recentActivity.length) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Recent activity
        </div>
        <p className="mt-3 text-sm text-slate-500">No recent activity yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Recent activity
        </div>
        <div className="mt-1 text-sm text-slate-600">
          The latest inventory and sales events across your workspace.
        </div>
      </div>

      <div className="space-y-3">
        {data.recentActivity.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:bg-slate-100/70"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${typeBadgeClass(
                      item.type
                    )}`}
                  >
                    {typeLabel(item.type)}
                  </span>
                </div>

                <div className="mt-3 font-medium text-slate-900">
                  {item.title}
                </div>

                {item.subtitle ? (
                  <div className="mt-1 text-sm leading-6 text-slate-600">
                    {item.subtitle}
                  </div>
                ) : null}
              </div>

              <div className="shrink-0 text-xs text-slate-400">
                {formatTimestamp(item.createdAtMs)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}