import { useEffect, useMemo, useRef } from "react";
import JsBarcode from "jsbarcode";

type Props = {
  productName: string;
  sku: string;
  barcode?: string | null;
};

export default function ProductBarcodeCard({
  productName,
  sku,
  barcode,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const printableBarcode = useMemo(() => {
    const value = String(barcode ?? "").trim();
    return value || null;
  }, [barcode]);

  useEffect(() => {
    if (!svgRef.current || !printableBarcode) return;

    try {
      JsBarcode(svgRef.current, printableBarcode, {
        format: "CODE128",
        displayValue: true,
        fontSize: 16,
        margin: 8,
        width: 2,
        height: 64,
      });
    } catch (error) {
      console.error("Failed to render barcode", error);
    }
  }, [printableBarcode]);

  function handlePrint() {
    if (!printableBarcode || !svgRef.current) return;

    const svgMarkup = svgRef.current.outerHTML;
    const printWindow = window.open("", "_blank", "width=600,height=800");

    if (!printWindow) return;

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Print Barcode Label</title>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              margin: 0;
              padding: 24px;
              color: #111827;
            }

            .label {
              width: 360px;
              border: 1px solid #d1d5db;
              border-radius: 16px;
              padding: 20px;
            }

            .product-name {
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 6px;
            }

            .sku {
              font-size: 14px;
              color: #4b5563;
              margin-bottom: 16px;
            }

            .barcode-number {
              margin-top: 10px;
              font-size: 14px;
              color: #374151;
            }

            .barcode-wrap {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 8px 0;
            }

            @media print {
              body {
                padding: 0;
              }

              .label {
                border: none;
                border-radius: 0;
                padding: 12px;
              }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="product-name">${escapeHtml(productName)}</div>
            <div class="sku">SKU: ${escapeHtml(sku)}</div>
            <div class="barcode-wrap">
              ${svgMarkup}
            </div>
            <div class="barcode-number">Barcode: ${escapeHtml(printableBarcode)}</div>
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
        Barcode label
      </div>

      {!printableBarcode ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          No barcode is assigned to this product yet.
        </div>
      ) : (
        <>
          <div className="mt-3 text-sm text-slate-600">
            Print a barcode label for receiving, counts, moves, and POS scans.
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-medium text-slate-900">{productName}</div>
            <div className="mt-1 text-sm text-slate-500">SKU: {sku}</div>

            <div className="mt-4 flex justify-center overflow-x-auto rounded-lg bg-white p-3">
              <svg ref={svgRef} />
            </div>

            <div className="mt-3 text-center text-sm text-slate-500">
              {printableBarcode}
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Print label
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}