import type { ProductStockStatus } from "../types";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  stockStatus: ProductStockStatus | "all";
  onStockStatusChange: (value: ProductStockStatus | "all") => void;
};

export default function ProductFilters({
  query,
  onQueryChange,
  stockStatus,
  onStockStatusChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_180px]">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search products
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by name, SKU, or barcode"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Stock status
          </label>
          <select
            value={stockStatus}
            onChange={(e) =>
              onStockStatusChange(e.target.value as ProductStockStatus | "all")
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="all">All</option>
            <option value="ok">OK</option>
            <option value="low">Low</option>
            <option value="out">Out</option>
          </select>
        </div>
      </div>
    </div>
  );
}