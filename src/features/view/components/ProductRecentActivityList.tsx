import type { RecentActivityFeedItem } from "../types";

function formatDate(value: number | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

type Props = {
  items: RecentActivityFeedItem[];
};

export default function ProductRecentActivityList({ items }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">Recent activity</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {items.length ? (
          items.map((item) => (
            <div key={item.id} className="px-4 py-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-gray-900">{item.title}</div>
                  <div className="mt-1 text-sm text-gray-600">
                    {item.subtitle || "—"}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-gray-400">
                    {item.type}
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  {formatDate(item.createdAtMs)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            No recent activity for this product.
          </div>
        )}
      </div>
    </div>
  );
}