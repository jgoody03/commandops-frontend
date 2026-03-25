import { Link, useParams } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import ProductDetailHeader from "@/features/view/components/ProductDetailHeader";
import ProductLocationBreakdownTable from "@/features/view/components/ProductLocationBreakdownTable";
import ProductRecentActivityList from "@/features/view/components/ProductRecentActivityList";
import { useProductDetailSnapshot } from "@/features/view/hooks";

export default function ViewProductDetailPage() {
  const { productId = "" } = useParams();

  const { data, loading, error } = useProductDetailSnapshot({
    productId,
    activityLimit: 10,
  });

  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Something went wrong."
        : null;

  const summary = data?.summary ?? null;

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                View · Product Detail
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Inventory, location breakdown, activity, and next actions for a single SKU.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                to="/view/products"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm">
            {errorMessage}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
            Loading product detail...
          </div>
        ) : summary ? (
          <>
            <ProductDetailHeader summary={summary} />

            <div className="grid gap-4 md:grid-cols-5">
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">On hand</div>
                <div className="mt-2 text-2xl font-semibold text-gray-900">
                  {summary.totalOnHand}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">Available</div>
                <div className="mt-2 text-2xl font-semibold text-gray-900">
                  {summary.totalAvailable}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">Locations</div>
                <div className="mt-2 text-2xl font-semibold text-gray-900">
                  {summary.totalLocations}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">Low stock</div>
                <div className="mt-2 text-2xl font-semibold text-gray-900">
                  {summary.locationsLowStock}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">Out of stock</div>
                <div className="mt-2 text-2xl font-semibold text-gray-900">
                  {summary.locationsOutOfStock}
                </div>
              </div>
            </div>

            <ProductLocationBreakdownTable
              productId={summary.productId}
              sku={summary.sku}
              name={summary.name}
              barcode={summary.primaryBarcode ?? null}
              items={data?.locations ?? []}
            />

            <ProductRecentActivityList items={data?.recentActivity ?? []} />
          </>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
            Product detail not found.
          </div>
        )}
      </div>
    </PageShell>
  );
}