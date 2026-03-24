type Props = {
  scanCode: string;
  name: string;
  sku: string;
  isSubmitting?: boolean;
  onNameChange: (value: string) => void;
  onSkuChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
  onCancel: () => void;
};

export default function ReceiveQuickCreatePanel({
  scanCode,
  name,
  sku,
  isSubmitting = false,
  onNameChange,
  onSkuChange,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-gray-900">
          Product not found
        </h2>
        <p className="mt-1 text-sm text-gray-700">
          Create a product for barcode <span className="font-medium">{scanCode}</span>.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Product name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            disabled={isSubmitting}
            placeholder="Example: Coke 20oz"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            SKU
          </label>
          <input
            type="text"
            value={sku}
            onChange={(e) => onSkuChange(e.target.value)}
            disabled={isSubmitting}
            placeholder="Example: COKE-20OZ"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !name.trim() || !sku.trim()}
            className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSubmitting ? "Creating..." : "Create product"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}