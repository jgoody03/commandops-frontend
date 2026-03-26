import { Link } from "react-router-dom";
import type { ProductSummaryListItem } from "../types";

function formatDate(value: number | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

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
  items: ProductSummaryListItem[];
};

export default function ProductSummaryTable({ items }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Barcode</th>
              <th className="px-4 py-3 font-medium">On hand</th>
              <th className="px-4 py-3 font-medium">Available</th>
              <th className="px-4 py-3 font-medium">Locations</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last activity</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 align-top">
<td className="px-4 py-3">
  <Link
    to={`/view/products/${item.productId}`}
    className="font-medium text-blue-600 hover:text-blue-700"
  >
    {item.name}
  </Link>
  <div className="text-gray-500">{item.sku}</div>
</td>
                <td className="px-4 py-3 text-gray-700">
                  {item.primaryBarcode || "—"}
                </td>
                <td className="px-4 py-3 text-gray-900">{item.totalOnHand}</td>
                <td className="px-4 py-3 text-gray-900">{item.totalAvailable}</td>
                <td className="px-4 py-3 text-gray-700">
                  <div>In stock: {item.locationsInStock}</div>
                  <div>Low: {item.locationsLowStock}</div>
                  <div>Out: {item.locationsOutOfStock}</div>
                </td>
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
  to={`/ops/receive?productId=${item.productId}&sku=${encodeURIComponent(
    item.sku
  )}&name=${encodeURIComponent(item.name)}&barcode=${encodeURIComponent(
    item.primaryBarcode ?? ""
  )}`}
  className="text-sm font-medium text-blue-600 hover:text-blue-700"
>
  Receive
</Link>
<Link
  to={`/ops/move?productId=${item.productId}&sku=${encodeURIComponent(
    item.sku
  )}&name=${encodeURIComponent(item.name)}&barcode=${encodeURIComponent(
    item.primaryBarcode ?? ""
  )}`}
  className="text-sm font-medium text-blue-600 hover:text-blue-700"
>
  Move
</Link>
<Link
  to={`/ops/count?productId=${item.productId}&sku=${encodeURIComponent(
    item.sku
  )}&name=${encodeURIComponent(item.name)}&barcode=${encodeURIComponent(
    item.primaryBarcode ?? ""
  )}`}
  className="text-sm font-medium text-blue-600 hover:text-blue-700"
>
  Count
</Link>
  <Link
  to={`/ops/adjust?productId=${item.productId}&sku=${encodeURIComponent(
    item.sku
  )}&name=${encodeURIComponent(item.name)}&barcode=${encodeURIComponent(
    item.primaryBarcode ?? ""
  )}`}
  className="text-sm font-medium text-blue-600 hover:text-blue-700"
>
  Adjust
</Link>                
                  </div>
                </td>
              </tr>
            ))}

            {!items.length ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}