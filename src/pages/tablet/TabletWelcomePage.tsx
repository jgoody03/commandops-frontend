import { useNavigate } from "react-router-dom";

export default function TabletWelcomePage() {
  const navigate = useNavigate();

  function handleContinue() {
    localStorage.setItem("sp_tablet_welcome_seen", "true");
    navigate("/hub", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-slate-900">
          You’re all set
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your store is ready. This tablet is your command center for inventory,
          operations, and daily workflow.
        </p>

        <button
          onClick={handleContinue}
          className="mt-8 w-full rounded-xl bg-slate-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
        >
          Enter dashboard
        </button>
      </div>
    </div>
  );
}