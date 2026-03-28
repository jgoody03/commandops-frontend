type Props = {
  onNext: () => void;
};

export default function StepWelcome({ onNext }: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        Step 1 of 3
      </div>

      <h1 className="mt-3 text-3xl font-semibold text-slate-900">
        Welcome to StorePilot
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Let’s get your store set up. This first pass is quick and focused, so
        you can start using the system in just a few minutes.
      </p>

      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-900">
        First, you’ll add a location. Then you can optionally add a starter
        product before jumping into the app.
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
        >
          Let’s get started
        </button>
      </div>
    </div>
  );
}