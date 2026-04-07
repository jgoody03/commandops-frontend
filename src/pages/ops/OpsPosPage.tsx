import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Camera, ScanLine, ShoppingCart } from "lucide-react";
import { OpsShell } from "@/components/layout/OpsShell";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import { resolveScanCode } from "@/features/ops/api/resolveScanCode";
import { ingestPosSale } from "@/features/ops/api/ingestPosSale";
import { useLocationSummaryList } from "@/features/locations/hooks/useLocationSummaryList";
import CameraBarcodeScanner from "@/features/ops/components/CameraBarcodeScanner";

type CartLine = {
  id: string;
  productId: string;
  name: string;
  sku: string;
  barcode?: string | null;
  quantity: number;
  unitPrice: number;
};

type TenderType = "cash" | "card" | "other";

export default function OpsPosPage() {
  const { workspaceId } = useWorkspaceContext();
  const { data: locationsData } = useLocationSummaryList();
  const locations = locationsData?.items ?? [];

  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [showCameraScanner, setShowCameraScanner] = useState(false);

  const [scanInput, setScanInput] = useState("");
  const scanRef = useRef<HTMLInputElement | null>(null);
  const lastScannedRef = useRef<{ code: string; at: number } | null>(null);

  const [resolvedProduct, setResolvedProduct] = useState<{
    productId: string;
    name: string;
    sku: string;
    price: number;
  } | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [tenderType, setTenderType] = useState<TenderType>("card");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    scanRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!selectedLocationId && locations.length > 0) {
      setSelectedLocationId(locations[0].locationId);
    }
  }, [locations, selectedLocationId]);

  useEffect(() => {
    if (showCameraScanner) {
      scanRef.current?.blur();
    }
  }, [showCameraScanner]);

  function flashMessage(message: string, timeout = 900) {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(null), timeout);
  }

  function addResolvedProductToCart(product: {
    productId: string;
    name: string;
    sku: string;
    price: number;
    barcode?: string | null;
  }) {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.productId);

      if (existing) {
        return prev.map((c) =>
          c.productId === product.productId
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }

      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          productId: product.productId,
          name: product.name,
          sku: product.sku,
          barcode: product.barcode ?? null,
          quantity: 1,
          unitPrice: product.price,
        },
      ];
    });

    navigator.vibrate?.(50);
    flashMessage(`${product.name} added`);
  }

  async function handleResolve() {
    if (!workspaceId || !scanInput.trim()) return;

    const result = await resolveScanCode({
      workspaceId,
      code: scanInput.trim(),
    });

    if (result.resolutionStatus === "resolved") {
      setResolvedProduct({
        productId: result.productId,
        name: result.productName,
        sku: result.sku,
        price: result.price ?? 0,
      });
      setQuantity(1);
    } else {
      setResolvedProduct(null);
      flashMessage("Product not found", 1200);
    }
  }

  function handleAddToCart() {
    if (!resolvedProduct) return;

    const existing = cart.find(
      (c) => c.productId === resolvedProduct.productId
    );

    if (existing) {
      setCart((prev) =>
        prev.map((c) =>
          c.productId === existing.productId
            ? { ...c, quantity: c.quantity + quantity }
            : c
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          productId: resolvedProduct.productId,
          name: resolvedProduct.name,
          sku: resolvedProduct.sku,
          quantity,
          unitPrice: resolvedProduct.price,
        },
      ]);
    }

    flashMessage(`${resolvedProduct.name} added`);
    setResolvedProduct(null);
    setScanInput("");
    setQuantity(1);

    if (!showCameraScanner) {
      scanRef.current?.focus();
      scanRef.current?.select();
    }
  }

  function removeLine(id: string) {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
    [cart]
  );

  async function handleCompleteSale() {
    if (!workspaceId || !selectedLocationId || cart.length === 0) return;

    setSubmitting(true);

    try {
      await ingestPosSale({
        workspaceId,
        locationId: selectedLocationId,
        saleId: `sale-${Date.now()}`,
        tenderType,
        note: "POS demo sale",
        lines: cart.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          barcode: line.barcode ?? undefined,
        })),
      });

      setCart([]);
      flashMessage("Sale completed successfully", 3000);

      if (!showCameraScanner) {
        scanRef.current?.focus();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to post sale");
    } finally {
      setSubmitting(false);
    }
  }
const handleCameraDetected = useCallback(
  (code: string) => {
    setScanInput(code);

    void (async () => {
      if (!workspaceId) return;

      const result = await resolveScanCode({
        workspaceId,
        code,
      });

      if (result.resolutionStatus === "resolved") {
        const product = {
          productId: result.productId,
          name: result.productName,
          sku: result.sku,
          price: result.price ?? 0,
          barcode: code,
        };

        setCart((prev) => {
          const existing = prev.find((c) => c.productId === product.productId);

          if (existing) {
            return prev.map((c) =>
              c.productId === product.productId
                ? { ...c, quantity: c.quantity + 1 }
                : c
            );
          }

          return [
            ...prev,
            {
              id: crypto.randomUUID(),
              productId: product.productId,
              name: product.name,
              sku: product.sku,
              barcode: product.barcode,
              quantity: 1,
              unitPrice: product.price,
            },
          ];
        });

        navigator.vibrate?.(50);
        setSuccessMessage(`${product.name} added`);
        window.setTimeout(() => setSuccessMessage(null), 900);

        setResolvedProduct(null);
        setQuantity(1);
        setScanInput("");
      } else {
        setResolvedProduct(null);
        setSuccessMessage("Product not found");
        window.setTimeout(() => setSuccessMessage(null), 1200);
      }
    })();
  },
  [workspaceId]
);
  return (
    <OpsShell
      title="POS Demo"
      subtitle="Simulate sales and validate inventory decrement behavior."
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="rounded-2xl border p-4 bg-white">
          <div className="text-sm font-medium mb-2">Location</div>
          <select
            className="w-full border rounded-lg p-2"
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
          >
            <option value="">Select location</option>
            {locations.map((loc) => (
              <option key={loc.locationId} value={loc.locationId}>
                {loc.locationName}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <ScanLine size={18} />
            <div className="font-medium">Scan Product</div>
          </div>

          <div className="flex gap-2">
            <input
              ref={scanRef}
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="flex-1 border rounded-lg p-2"
              placeholder="Scan barcode or enter code"
              readOnly={showCameraScanner}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void handleResolve();
                }
              }}
            />

            <button
              onClick={() => void handleResolve()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg"
            >
              Add
            </button>

            <button
              onClick={() => setShowCameraScanner((c) => !c)}
              className="px-3 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg"
            >
              <Camera size={18} />
            </button>
          </div>

{showCameraScanner ? (
  <div className="mt-4">
    <CameraBarcodeScanner
      onDetected={handleCameraDetected}
      onClose={() => setShowCameraScanner(false)}
    />
  </div>
) : null}
        </div>

        {resolvedProduct ? (
          <div className="rounded-2xl border p-4 bg-white">
            <div className="font-medium">{resolvedProduct.name}</div>
            <div className="text-sm text-gray-500">{resolvedProduct.sku}</div>

            <div className="mt-2 text-sm">
              Price: ${resolvedProduct.price.toFixed(2)}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 border rounded-lg p-2"
              />

              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart size={18} />
            <div className="font-medium">Cart</div>
          </div>

          {cart.length === 0 ? (
            <div className="text-sm text-gray-500">No items yet</div>
          ) : null}

          {cart.map((line) => (
            <div
              key={line.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <div className="font-medium">{line.name}</div>
                <div className="text-sm text-gray-500">
                  {line.quantity} × ${line.unitPrice.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="font-medium">
                  ${(line.quantity * line.unitPrice).toFixed(2)}
                </div>

                <button
                  onClick={() => removeLine(line.id)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-4 bg-white">
          <div className="flex justify-between mb-3">
            <div className="font-medium">Subtotal</div>
            <div className="font-semibold">${subtotal.toFixed(2)}</div>
          </div>

          <div className="mb-3">
            <div className="text-sm mb-1">Tender</div>
            <select
              value={tenderType}
              onChange={(e) => setTenderType(e.target.value as TenderType)}
              className="w-full border rounded-lg p-2"
            >
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            disabled={!selectedLocationId || !cart.length || submitting}
            onClick={handleCompleteSale}
            className="w-full py-3 bg-gray-900 text-white rounded-xl disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Complete Sale"}
          </button>

          {successMessage ? (
            <div className="mt-3 text-green-600 text-sm">{successMessage}</div>
          ) : null}
        </div>
      </div>
    </OpsShell>
  );
}