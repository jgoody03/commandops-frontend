import { useMemo, useState } from "react";
import { History } from "lucide-react";
import { OpsShell } from "@/components/layout/OpsShell";
import { useReceiveHistory } from "@/features/receives/hooks/useReceiveHistory";
import { useReceiveDetail } from "@/features/receives/hooks/useReceiveDetail";

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
      {subtext ? (
        <div className="mt-2 text-sm text-slate-500">{subtext}</div>
      ) : null}
    </div>
  );
}

export default function OpsReceiveHistoryPage() {
  const { data, loading, error } = useReceiveHistory(30);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(
    null
  );

  const {
    data: selectedReceive,
    loading: detailLoading,
    error: detailError,
  } = useReceiveDetail(selectedTransactionId);

  const receiveInsights = useMemo(() => {
    const totalReceives = data.length;
    const totalLines = data.reduce((sum, item) => sum + (item.lineCount ?? 0), 0);

    const vendorCounts = new Map<string, number>();

    for (const item of data) {
      const vendor = item.vendorName?.trim();
      if (!vendor) continue;
      vendorCounts.set(vendor, (vendorCounts.get(vendor) ?? 0) + 1);
    }

    let topVendor: string | null = null;
    let topVendorCount = 0;

    for (const [vendor, count] of vendorCounts.entries()) {
      if (count > topVendorCount) {
        topVendor = vendor;
        topVendorCount = count;
      }
    }

    const mostRecentReceiveMs =
      data.length > 0 ? Math.max(...data.map((item) => item.postedAtMs)) : null;

    return {
      totalReceives,
      totalLines,
      topVendor,
      topVendorCount,
      mostRecentReceiveMs,
    };
  }, [data]);

  return (
    <OpsShell
      title="Receive History"
      subtitle="Review recent receiving sessions across your workspace."
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <History size={20} />
            </div>

            <div>
              <div className="font-semibold text-slate-900">Recent receives</div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Track what came in, from who, and where it went.
              </p>
            </div>
          </div>
        </div>

        {!loading && !error ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InsightCard
              label="Receives"
              value={String(receiveInsights.totalReceives)}
              subtext="Recent receive sessions"
            />
            <InsightCard
              label="Received lines"
              value={String(receiveInsights.totalLines)}
              subtext="Across recent sessions"
            />
            <InsightCard
              label="Top vendor"
              value={receiveInsights.topVendor ?? "—"}
              subtext={
                receiveInsights.topVendor
                  ? `${receiveInsights.topVendorCount} receive${
                      receiveInsights.topVendorCount === 1 ? "" : "s"
                    }`
                  : "No vendor activity yet"
              }
            />
            <InsightCard
              label="Most recent"
              value={
                receiveInsights.mostRecentReceiveMs
                  ? formatShortDate(receiveInsights.mostRecentReceiveMs)
                  : "—"
              }
              subtext={
                receiveInsights.mostRecentReceiveMs
                  ? formatDateTime(receiveInsights.mostRecentReceiveMs)
                  : "No receive history yet"
              }
            />
          </div>
        ) : null}

        {!loading && !error && data.length > 0 && !receiveInsights.topVendor ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm">
            Receives are being tracked, but vendors have not been used consistently
            yet. Add vendor names during receiving to improve reporting.
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading receive history...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
            {error}
          </div>
        ) : null}

        {!loading && !error && data.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            No receive history yet. Post a receive session to start building history.
          </div>
        ) : null}

        {!loading && !error && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((item) => (
              <button
                key={item.transactionId}
                type="button"
                onClick={() => setSelectedTransactionId(item.transactionId)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">
                      {item.vendorName || "Manual receive"}
                      {item.locationName ? (
                        <span className="ml-2 text-sm font-normal text-slate-500">
                          → {item.locationName}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      {formatDateTime(item.postedAtMs)}
                    </div>

                    <div className="mt-2 text-sm text-slate-600">
                      {item.lineCount && item.lineCount > 0
                        ? `${item.lineCount} line${
                            item.lineCount === 1 ? "" : "s"
                          }`
                        : "View details for lines"}
                      {item.referenceNumber ? ` • Ref: ${item.referenceNumber}` : ""}
                    </div>

                    {item.note ? (
                      <div className="mt-2 text-sm text-slate-500">
                        Note: {item.note}
                      </div>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : null}

        {selectedTransactionId ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-slate-900">Receive detail</div>
                <p className="mt-1 text-sm text-slate-600">
                  Review the line items and metadata for the selected receive.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransactionId(null)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {detailLoading ? (
              <div className="mt-4 text-sm text-slate-500">Loading detail...</div>
            ) : null}

            {detailError ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                {detailError}
              </div>
            ) : null}

            {selectedReceive ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="font-medium text-slate-900">
                    {selectedReceive.vendorName || "Manual receive"}
                    {selectedReceive.locationName
                      ? ` → ${selectedReceive.locationName}`
                      : ""}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">
                    {new Date(selectedReceive.postedAtMs).toLocaleString()}
                  </div>

                  <div className="mt-2 text-sm text-slate-600">
                    {(selectedReceive.lineCount ?? selectedReceive.lines.length)} line
                    {(selectedReceive.lineCount ?? selectedReceive.lines.length) === 1
                      ? ""
                      : "s"}
                    {selectedReceive.referenceNumber
                      ? ` • Ref: ${selectedReceive.referenceNumber}`
                      : ""}
                  </div>

                  {selectedReceive.note ? (
                    <div className="mt-2 text-sm text-slate-500">
                      Note: {selectedReceive.note}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-3">
                  {selectedReceive.lines.map((line) => (
                    <div
                      key={line.lineId}
                      className="rounded-xl border border-slate-200 px-4 py-3"
                    >
                      <div className="font-medium text-slate-900">{line.sku}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        Qty: {line.quantity}
                        {line.unitCost !== null && line.unitCost !== undefined
                          ? ` • Cost: $${line.unitCost}`
                          : ""}
                        {line.barcode ? ` • Barcode: ${line.barcode}` : ""}
                      </div>
                      {line.note ? (
                        <div className="mt-1 text-sm text-slate-500">
                          Note: {line.note}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </OpsShell>
  );
}