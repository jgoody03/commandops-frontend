import { Link } from "react-router-dom";
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

function activityLink(item: GetTodaySnapshotOutput["recentActivity"][number]) {
  if (item.productId) {
    return `/view/products/${item.productId}`;
  }

  if (item.locationId) {
    return `/view/locations/${item.locationId}`;
  }

  return "/view";
}

function activityHelperText(
  item: GetTodaySnapshotOutput["recentActivity"][number]
) {
  if (item.productId) {
    return "Open product detail";
  }

  if (item.locationId) {
    return "Open location inventory";
  }

  return "Open workspace view";
}

export default function RecentActivityList({ data, loading, error }: Props) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-4 shadow">
        Loading recent activity...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-4 shadow">
        Unable to load recent activity.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Activity
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          No recent activity available yet.
        </p>
      </div>
    );
  }

  if (!data.recentActivity.length) {
    return (
      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Activity
        </h2>
        <p className="mt-2 text-sm text-slate-500">No recent activity yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>
          <p className="text-sm text-slate-500">
            Follow the latest operational changes and jump into the right
            product or location.
          </p>
        </div>

        <Link
          to="/view"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Open view workspace
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {data.recentActivity.map((item) => (
          <Link
            key={item.id}
            to={activityLink(item)}
            className="block rounded-lg border border-slate-200 px-3 py-3 transition hover:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-900">{item.title}</div>
                {item.subtitle ? (
                  <div className="mt-1 text-sm text-slate-500">
                    {item.subtitle}
                  </div>
                ) : null}
              </div>

              <div className="shrink-0 text-xs text-slate-400">
                {formatTimestamp(item.createdAtMs)}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                {item.type}
              </div>

              <div className="text-sm font-medium text-blue-600">
                {activityHelperText(item)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}