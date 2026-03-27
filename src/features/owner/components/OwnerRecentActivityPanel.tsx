import { Link } from "react-router-dom";
import type { GetTodaySnapshotOutput } from "@/features/hub/api/getTodaySnapshot";

type Props = {
  snapshot: GetTodaySnapshotOutput | null;
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

export default function OwnerRecentActivityPanel({ snapshot }: Props) {
  const items = snapshot?.recentActivity?.slice(0, 5) ?? [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>
          <p className="text-sm text-slate-500">
            A quick look at what changed recently.
          </p>
        </div>

        <Link
          to="/view"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Open workspace
        </Link>
      </div>

      {!items.length ? (
        <div className="mt-4 text-sm text-slate-500">
          No recent activity is available yet.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              to={activityLink(item)}
              className="block rounded-xl border border-slate-200 px-4 py-3 transition hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-slate-900">{item.title}</div>
                  {item.subtitle ? (
                    <div className="mt-1 text-sm text-slate-500">
                      {item.subtitle}
                    </div>
                  ) : null}
                </div>

                <div className="text-xs text-slate-400">
                  {formatTimestamp(item.createdAtMs)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}