import { useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import { OpsShell } from "@/components/layout/OpsShell";
import { useVendors } from "@/features/vendors/hooks/useVendors";
import { useVendorReceiveHistory } from "@/features/vendors/hooks/useVendorReceiveHistory";

function formatDateTime(ms: number) {
  return new Date(ms).toLocaleString();
}

function formatShortDate(ms: number) {
  return new Date(ms).toLocaleDateString();
}

function InsightCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      {subtext ? <div className="mt-2 text-sm text-slate-500">{subtext}</div> : null}
    </div>
  );
}

export default function OpsVendorPage() {
  const { data: vendors, loading, error } = useVendors(50);
  const [selectedVendorName, setSelectedVendorName] = useState<string | null>(null);

  const {
    data: vendorHistory,
    loading: vendorHistoryLoading,
    error: vendorHistoryError,
  } = useVendorReceiveHistory(selectedVendorName, 20);

  const vendorInsights = useMemo(() => {
    const totalVendors = vendors.length;

    let topVendor: string | null = null;
    let topVendorCount = 0;
    let mostRecentVendor: string | null = null;
    let mostRecentAt: number | null = null;

    for (const vendor of vendors) {
      const count = vendor.receiveCount ?? 0;
      if (count > topVendorCount) {
        topVendorCount = count;
        topVendor = vendor.name;
      }

      if (
        vendor.lastReceivedAtMs &&
        (!mostRecentAt || vendor.lastReceivedAtMs > mostRecentAt)
      ) {
        mostRecentAt = vendor.lastReceivedAtMs;
        mostRecentVendor = vendor.name;
      }
    }

    return {
      totalVendors,
      topVendor,
      topVendorCount,
      mostRecentVendor,
      mostRecentAt,
    };
  }, [vendors]);

  return (
    <OpsShell
      title="Vendors"
      subtitle="Review the vendors your workspace receives inventory from."
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <Building2 size={20} />
            </div>

            <div>
              <div className="font-semibold text-slate-900">Vendor activity</div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                See who you receive from, how often, and when you last worked with them.
              </p>
            </div>
          </div>
        </div>

        {!loading && !error ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InsightCard
              label="Vendors"
              value={String(vendorInsights.totalVendors)}
              subtext="Saved vendors in this workspace"
            />
            <InsightCard
              label="Top vendor"
              value={vendorInsights.topVendor ?? "—"}
              subtext={
                vendorInsights.topVendor
                  ? `${vendorInsights.topVendorCount} receive${
                      vendorInsights.topVendorCount === 1 ? "" : "s"
                    }`
                  : "No vendor history yet"
              }
            />
            <InsightCard
              label="Most recent vendor"
              value={vendorInsights.mostRecentVendor ?? "—"}
              subtext={
                vendorInsights.mostRecentAt
                  ? formatDateTime(vendorInsights.mostRecentAt)
                  : "No recent activity"
              }
            />
            <InsightCard
              label="Selected vendor"
              value={selectedVendorName ?? "—"}
              subtext={
                selectedVendorName
                  ? "Viewing recent receives"
                  : "Pick a vendor below"
              }
            />
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading vendors...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
            {error}
          </div>
        ) : null}

        {!loading && !error && vendors.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            No saved vendors yet. Use the receive workflow with vendor names to start building vendor history.
          </div>
        ) : null}

        {!loading && !error && vendors.length > 0 ? (
          <div className="space-y-3">
            {vendors.map((vendor) => (
              <button
                key={vendor.vendorId}
                type="button"
                onClick={() => setSelectedVendorName(vendor.name)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {vendor.name}
                    </div>

                    <div className="mt-1 text-sm text-slate-600">
                      {vendor.receiveCount ?? 0} receive
                      {(vendor.receiveCount ?? 0) === 1 ? "" : "s"}
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      {vendor.lastReceivedAtMs
                        ? `Last receive: ${formatDateTime(vendor.lastReceivedAtMs)}`
                        : "No receive date recorded"}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {selectedVendorName ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-slate-900">
                  Vendor detail
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Recent receives for {selectedVendorName}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVendorName(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {vendorHistoryLoading ? (
              <div className="mt-4 text-sm text-slate-500">
                Loading vendor history...
              </div>
            ) : null}

            {vendorHistoryError ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                {vendorHistoryError}
              </div>
            ) : null}

            {vendorHistory && vendorHistory.items.length > 0 ? (
              <div className="mt-4 space-y-3">
                {vendorHistory.items.map((item) => (
                  <div
                    key={item.transactionId}
                    className="rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <div className="font-medium text-slate-900">
                      {item.locationName || "Unknown location"}
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      {formatDateTime(item.postedAtMs)}
                    </div>

                    <div className="mt-2 text-sm text-slate-600">
                      {item.lineCount && item.lineCount > 0
                        ? `${item.lineCount} line${item.lineCount === 1 ? "" : "s"}`
                        : "Receive detail available"}
                      {item.referenceNumber ? ` • Ref: ${item.referenceNumber}` : ""}
                    </div>

                    {item.note ? (
                      <div className="mt-2 text-sm text-slate-500">
                        Note: {item.note}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            {vendorHistory &&
            !vendorHistoryLoading &&
            !vendorHistoryError &&
            vendorHistory.items.length === 0 ? (
              <div className="mt-4 text-sm text-slate-500">
                No receive history found for this vendor.
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </OpsShell>
  );
}