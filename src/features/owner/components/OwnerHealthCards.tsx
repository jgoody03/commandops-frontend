import { Link } from "react-router-dom";

type Props = {
  totalProducts: number;
  totalLocations: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalUnits: number;
};

export default function OwnerHealthCards({
  totalProducts,
  totalLocations,
  lowStockCount,
  outOfStockCount,
  totalUnits,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <OwnerCard
        label="Products"
        value={totalProducts}
        to="/view/products"
        helperText="Browse catalog"
      />
      <OwnerCard
        label="Locations"
        value={totalLocations}
        to="/view"
        helperText="Review locations"
      />
      <OwnerCard
        label="Units"
        value={totalUnits}
        to="/view/products"
        helperText="See inventory"
      />
      <OwnerCard
        label="Low Stock"
        value={lowStockCount}
        to="/view/products?stockStatus=low"
        helperText="Needs review"
      />
      <OwnerCard
        label="Out of Stock"
        value={outOfStockCount}
        to="/view/products?stockStatus=out"
        helperText="Most urgent"
      />
    </div>
  );
}

function OwnerCard({
  label,
  value,
  to,
  helperText,
}: {
  label: string;
  value: number;
  to: string;
  helperText: string;
}) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
    >
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
      <div className="mt-2 text-sm font-medium text-blue-600">{helperText}</div>
    </Link>
  );
}