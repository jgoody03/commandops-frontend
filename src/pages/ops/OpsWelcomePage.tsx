import { useNavigate } from "react-router-dom";
import {
  ArrowRightLeft,
  ClipboardList,
  PackagePlus,
  SlidersHorizontal,
} from "lucide-react";

export default function OpsWelcomePage() {
  const navigate = useNavigate();

  function handleContinue() {
    localStorage.setItem("sp_ops_welcome_seen", "true");
    navigate("/ops", { replace: true });
  }

  const actions = [
    {
      icon: PackagePlus,
      title: "Receive",
      description: "Bring new inventory into the system quickly.",
    },
    {
      icon: ArrowRightLeft,
      title: "Move",
      description: "Shift stock between locations with minimal steps.",
    },
    {
      icon: SlidersHorizontal,
      title: "Adjust",
      description: "Correct inventory when something changes on the floor.",
    },
    {
      icon: ClipboardList,
      title: "Count",
      description: "Record real counts and keep balances accurate.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            StorePilot Handheld
          </div>

          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Ready to work
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            This device is set up for daily inventory work. Use it to receive,
            move, adjust, and count inventory fast.
          </p>
        </div>

        <div className="space-y-3">
          {actions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                    <Icon size={20} />
                  </div>

                  <div>
                    <div className="font-medium text-slate-900">
                      {item.title}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="rounded-2xl bg-slate-900 px-5 py-4 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
        >
          Start working
        </button>
      </div>
    </div>
  );
}