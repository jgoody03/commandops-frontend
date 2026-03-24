import { FormEvent, useEffect, useRef, useState } from "react";

type Props = {
  code: string;
  onSubmit: (code: string) => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
};

export default function ReceiveScanPanel({
  code,
  onSubmit,
  isLoading = false,
  disabled = false,
}: Props) {
  const [value, setValue] = useState(code);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValue(code);
  }, [code]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled || isLoading) return;
    onSubmit(trimmed);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-base font-semibold text-gray-900">Scan item</h2>
        <p className="mt-1 text-sm text-gray-600">
          Barcode scanner input or manual entry.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Scan or enter barcode"
          disabled={disabled || isLoading}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
        />

        <button
          type="submit"
          disabled={disabled || isLoading || !value.trim()}
          className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isLoading ? "Resolving..." : "Resolve item"}
        </button>
      </form>
    </div>
  );
}