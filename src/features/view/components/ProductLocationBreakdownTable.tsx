import { Link } from "react-router-dom";
import type { ProductLocationInventoryItem } from "../types";

function formatDate(value: number | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function statusClasses(status: ProductLocationInventoryItem["stockStatus"]) {
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
  productId: string;
  sku: string;
  name: string;
  barcode?: string | null;
  items: ProductLocationInventoryItem[];
};

export default function ProductLocationBreakdownTable({
  productId,
  sku,
  name,
  barcode,
  items,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">By location</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">On hand</th>
              <th className="px-4 py-3 font-medium">Available</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last activity</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.locationId} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {item.locationName}
                  </div>
                  <div className="text-gray-500">
                    {item.locationCode || item.locationId}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-900">{item.onHand}</td>
                <td className="px-4 py-3 text-gray-900">{item.available}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(
                      item.stockStatus
                    )}`}
                  >
                    {item.stockStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {formatDate(item.lastTransactionAtMs)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/ops/receive?productId=${productId}&sku=${encodeURIComponent(
                        sku
                      )}&name=${encodeURIComponent(name)}&barcode=${encodeURIComponent(
                        barcode ?? ""
                      )}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Receive
                    </Link>

                    <Link
                      to={`/ops/move?productId=${productId}&sku=${encodeURIComponent(
                        sku
                      )}&name=${encodeURIComponent(name)}&barcode=${encodeURIComponent(
                        barcode ?? ""
                      )}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Move
                    </Link>

                    <Link
                      to={`/ops/count?productId=${productId}&sku=${encodeURIComponent(
                        sku
                      )}&name=${encodeURIComponent(name)}&barcode=${encodeURIComponent(
                        barcode ?? ""
                      )}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Count
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {!items.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No location balances found for this product.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}