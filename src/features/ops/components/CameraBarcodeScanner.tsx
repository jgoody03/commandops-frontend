import { useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

type Props = {
  onDetected: (code: string) => void;
  onClose: () => void;
};

const SCANNER_ID = "commandops-camera-scanner";

export default function CameraBarcodeScanner({
  onDetected,
  onClose,
}: Props) {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const onDetectedRef = useRef(onDetected);
  const lockedUntilRef = useRef(0);

  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  const config = useMemo(
    () => ({
      fps: 10,
      qrbox: { width: 280, height: 180 },
      formatsToSupport: [
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
      ],
      rememberLastUsedCamera: true,
    }),
    []
  );

  useEffect(() => {
    let mounted = true;

    async function startScanner() {
      try {
        setStarting(true);
        setError(null);

        const scanner = new Html5Qrcode(SCANNER_ID);
        html5QrCodeRef.current = scanner;

        const cameras = await Html5Qrcode.getCameras();
        if (!mounted) return;

        if (!cameras || cameras.length === 0) {
          setError("No camera was found on this device.");
          setStarting(false);
          return;
        }

        const preferredCamera =
          cameras.find((c) => /back|rear|environment/i.test(c.label)) ??
          cameras[0];

        await scanner.start(
          preferredCamera.id,
          config,
          (decodedText) => {
            const now = Date.now();

            if (now < lockedUntilRef.current) {
              return;
            }

            lockedUntilRef.current = now + 1200;
            onDetectedRef.current(decodedText);
          },
          () => {
            // ignore misses
          }
        );

        if (!mounted) return;
        setStarting(false);
      } catch (err) {
        console.error("Camera scanner start failed", err);
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to start camera.");
        setStarting(false);
      }
    }

    void startScanner();

    return () => {
      mounted = false;

      async function cleanup() {
        try {
          if (html5QrCodeRef.current?.isScanning) {
            await html5QrCodeRef.current.stop();
          }
        } catch {}

        try {
          await html5QrCodeRef.current?.clear();
        } catch {}
      }

      void cleanup();
    };
  }, [config]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
            Camera scanner
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Point the rear camera at a barcode to scan.
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Close
        </button>
      </div>

      {starting ? (
        <div className="mt-4 text-sm text-slate-500">Starting camera...</div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      ) : null}

      <div
        id={SCANNER_ID}
        className="mt-4 overflow-hidden rounded-2xl border border-slate-200"
      />
    </div>
  );
}