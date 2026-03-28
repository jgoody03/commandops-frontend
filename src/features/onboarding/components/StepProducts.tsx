import { useMemo, useState } from "react";
import { useQuickCreateProduct } from "@/features/ops/hooks";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

type Props = {
  onBack: () => void;
  onNext: () => void;
};

type AddedProduct = {
  id: string;
  name: string;
  sku: string;
  primaryBarcode?: string | null;
  unit?: string | null;
};

function makeSuggestedSku(name: string) {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export default function StepProducts({ onBack, onNext }: Props) {
  const { workspaceId } = useWorkspaceContext();
  const quickCreateProduct = useQuickCreateProduct();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [addedProducts, setAddedProducts] = useState<AddedProduct[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const errorMessage =
    quickCreateProduct.error instanceof Error
      ? quickCreateProduct.error.message
      : quickCreateProduct.error
        ? "Unable to create product."
        : null;

  const canSave = useMemo(() => {
    return Boolean(workspaceId && name.trim() && sku.trim());
  }, [workspaceId, name, sku]);

  function handleNameChange(value: string) {
    setName(value);

    setSku((current) => {
      if (!current.trim() || current === makeSuggestedSku(name)) {
        return makeSuggestedSku(value);
      }
      return current;
    });
  }

  async function handleAddProduct() {
    if (!workspaceId || !canSave) return;

    const result = await quickCreateProduct.mutateAsync({
      workspaceId,
      name: name.trim(),
      sku: sku.trim(),
    });

    setAddedProducts((prev) => [
      ...prev,
      {
        id: result.product.id,
        name: result.product.name,
        sku: result.product.sku,
        primaryBarcode: result.product.primaryBarcode ?? null,
        unit: result.product.unit ?? null,
      },
    ]);

    setSuccessMessage(`Added ${result.product.name}.`);
    window.setTimeout(() => setSuccessMessage(null), 1600);

    setName("");
    setSku("");
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        Step 3 of 3
      </div>

      <h2 className="mt-3 text-2xl font-semibold text-slate-900">
        Add your first product
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        This step is optional, but adding a product now makes the system feel
        real right away. You can always add more later.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-base font-semibold text-slate-900">
            Quick add product
          </h3>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Product name
              </label>
              <input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Sparkling Water 12oz"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                SKU
              </label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="SPARKLING-WATER-12OZ"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-900"
              />
            </div>

            {errorMessage ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {successMessage}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void handleAddProduct()}
              disabled={!canSave || quickCreateProduct.isPending}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {quickCreateProduct.isPending ? "Adding..." : "Add product"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">
            Added products
          </h3>

          {addedProducts.length ? (
            <div className="mt-4 space-y-3">
              {addedProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl border border-slate-200 px-4 py-3"
                >
                  <div className="font-medium text-slate-900">
                    {product.name}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {product.sku}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm leading-6 text-slate-500">
              Start with just one product to see how inventory works, or skip
              this step and add products later from inside the app.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
        >
          Back
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Skip for now
          </button>

          <button
            type="button"
            onClick={onNext}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            Finish setup
          </button>
        </div>
      </div>
    </div>
  );
}