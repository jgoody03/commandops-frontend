import type { ResolvedProductSummary } from "../types";

type Props = {
  product: ResolvedProductSummary;
  scannedCode?: string;
};

export default function ReceiveProductCard({ product, scannedCode }: Props) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
        Product found
      </p>

      <h3 className="mt-1 text-lg font-semibold text-gray-900">
        {product.name}
      </h3>

      <div className="mt-2 space-y-1 text-sm text-gray-700">
        <p>
          <span className="font-medium text-gray-900">SKU:</span> {product.sku}
        </p>

        {product.barcode ? (
          <p>
            <span className="font-medium text-gray-900">Barcode:</span>{" "}
            {product.barcode}
          </p>
        ) : scannedCode ? (
          <p>
            <span className="font-medium text-gray-900">Scanned:</span>{" "}
            {scannedCode}
          </p>
        ) : null}

        {product.unitLabel ? (
          <p>
            <span className="font-medium text-gray-900">Unit:</span>{" "}
            {product.unitLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}