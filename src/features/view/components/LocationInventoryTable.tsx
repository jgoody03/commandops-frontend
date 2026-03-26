import { Link } from "react-router-dom";
import type { LocationInventoryItem } from "../types";

function formatDate(value: number | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

type Props = {
  items: LocationInventoryItem[];
};

export default function LocationInventoryTable({ items }: Props) {
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
              <th className="px-4 py-3 font-medium">Last activity</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const productId = item.product?.id ?? item.productId;
              const sku = item.product?.sku ?? item.productId;
              const name = item.product?.name ?? "Unknown product";
              const barcode = item.product?.primaryBarcode ?? "";

              const opsQuery = `productId=${productId}&sku=${encodeURIComponent(
                sku
              )}&name=${encodeURIComponent(name)}&barcode=${encodeURIComponent(
                barcode
              )}&locationId=${encodeURIComponent(item.locationId)}`;

              return (
                <tr key={item.id} className="border-t border-gray-100 align-top">
                  <td className="px-4 py-3">
                    <Link
                      to={`/view/products/${productId}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {name}
                    </Link>
                    <div className="text-gray-500">{sku}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {item.product?.primaryBarcode ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-900">{item.onHand}</td>
                  <td className="px-4 py-3 text-gray-900">{item.available}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(item.lastTransactionAtMs)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/ops/receive?${opsQuery}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Receive
                      </Link>
                      <Link
                        to={`/ops/move?${opsQuery}&sourceLocationId=${encodeURIComponent(
                          item.locationId
                        )}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Move
                      </Link>
                      <Link
                        to={`/ops/adjust?${opsQuery}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Adjust
                      </Link>
                      <Link
                        to={`/ops/count?${opsQuery}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Count
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!items.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No inventory found for this location.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}