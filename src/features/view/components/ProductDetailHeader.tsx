import { Link } from "react-router-dom";
import type { ProductSummaryListItem } from "../types";

function statusClasses(status: ProductSummaryListItem["stockStatus"]) {
  switch (status) {
    case "out":
      return "bg-rose-100 text-rose-700";
    case "low":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-emerald-100 text-emerald-700";
  }
}

type Props = {
  summary: ProductSummaryListItem;
};

export default function ProductDetailHeader({ summary }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-xs text-gray-400">
            No image
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                {summary.name}
              </h1>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(
                  summary.stockStatus
                )}`}
              >
                {summary.stockStatus}
              </span>
            </div>

            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div>SKU: {summary.sku}</div>
              <div>Barcode: {summary.primaryBarcode || "—"}</div>
              <div>Unit: {summary.unit || "—"}</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/ops/receive?productId=${summary.productId}&sku=${encodeURIComponent(
                  summary.sku
                )}&name=${encodeURIComponent(summary.name)}&barcode=${encodeURIComponent(
                  summary.primaryBarcode ?? ""
                )}`}
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Receive
              </Link>

              <Link
                to={`/ops/move?productId=${summary.productId}&sku=${encodeURIComponent(
                  summary.sku
                )}&name=${encodeURIComponent(summary.name)}&barcode=${encodeURIComponent(
                  summary.primaryBarcode ?? ""
                )}`}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Move
              </Link>

              <Link
                to={`/ops/adjust?productId=${summary.productId}&sku=${encodeURIComponent(
                  summary.sku
                )}&name=${encodeURIComponent(summary.name)}&barcode=${encodeURIComponent(
                  summary.primaryBarcode ?? ""
                )}`}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Adjust
              </Link>

              <Link
                to={`/ops/count?productId=${summary.productId}&sku=${encodeURIComponent(
                  summary.sku
                )}&name=${encodeURIComponent(summary.name)}&barcode=${encodeURIComponent(
                  summary.primaryBarcode ?? ""
                )}`}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Count
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-lg font-semibold text-gray-900">Pricing</div>
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <div>Cost: —</div>
          <div>Price: —</div>
          <div>Margin $: —</div>
          <div>Margin %: —</div>
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4">
          <div className="text-lg font-semibold text-gray-900">Media</div>
          <div className="mt-2 text-sm text-gray-600">
            Product images can be added here once media fields are included in the product detail contract.
          </div>
        </div>
      </div>
    </div>
  );
}