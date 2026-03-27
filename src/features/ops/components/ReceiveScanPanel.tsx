import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ScanLine } from "lucide-react";

export type ReceiveScanPanelHandle = {
  focusInput: () => void;
  clearInput: () => void;
};

type Props = {
  code?: string;
  onSubmit: (code: string) => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  repeatMode?: boolean;
  onRepeatModeChange?: (value: boolean) => void;
};

const ReceiveScanPanel = forwardRef<ReceiveScanPanelHandle, Props>(
  function ReceiveScanPanel(
    {
      code = "",
      onSubmit,
      isLoading = false,
      disabled = false,
      autoFocus = true,
      repeatMode = false,
      onRepeatModeChange,
    },
    ref
  ) {
    const [value, setValue] = useState(code);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      setValue(code);
    }, [code]);

    useEffect(() => {
      if (!autoFocus || disabled) return;

      const id = window.setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);

      return () => window.clearTimeout(id);
    }, [autoFocus, disabled]);

    useImperativeHandle(ref, () => ({
      focusInput() {
        inputRef.current?.focus();
        inputRef.current?.select();
      },
      clearInput() {
        setValue("");
        inputRef.current?.focus();
      },
    }));

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const trimmed = value.trim();
      if (!trimmed || disabled || isLoading) return;

      void onSubmit(trimmed);
    }

    return (
      <div className="sticky top-[4.5rem] z-20 rounded-2xl border border-blue-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
            <ScanLine size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Scan Focus
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              Scan or enter barcode
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Keep moving item to item. After each task, the scan field is ready
              for the next code.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled || isLoading}
            placeholder="Scan barcode or type code"
            className="h-14 flex-1 rounded-2xl border border-gray-300 px-4 text-lg text-gray-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100"
          />

          <button
            type="submit"
            disabled={!value.trim() || disabled || isLoading}
            className="h-14 rounded-2xl bg-gray-900 px-5 text-base font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoading ? "Resolving..." : "Resolve"}
          </button>
        </form>

        <label className="mt-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <input
            type="checkbox"
            checked={repeatMode}
            onChange={(e) => onRepeatModeChange?.(e.target.checked)}
            disabled={disabled || isLoading}
          />
Keep scanning
        </label>
      </div>
    );
  }
);

export default ReceiveScanPanel;