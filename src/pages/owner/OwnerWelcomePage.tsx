import { useNavigate } from "react-router-dom";
import { Activity, AlertTriangle, BarChart3 } from "lucide-react";

export default function OwnerWelcomePage() {
  const navigate = useNavigate();

  function handleContinue() {
    localStorage.setItem("sp_owner_welcome_seen", "true");
    navigate("/owner", { replace: true });
  }

  const cards = [
    {
      icon: AlertTriangle,
      title: "See what needs attention",
      description:
        "Quickly spot low stock, out-of-stock items, and operational issues.",
    },
    {
      icon: Activity,
      title: "Stay on top of activity",
      description:
        "Review what has been received, moved, adjusted, and counted recently.",
    },
    {
      icon: BarChart3,
      title: "Check store health fast",
      description:
        "Use this view as your simple business snapshot without digging through ops screens.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            StorePilot Owner View
          </div>

          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Your store at a glance
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            This view is built for quick check-ins. See what needs attention,
            understand activity, and keep your store moving without jumping into
            day-to-day task screens.
          </p>
        </div>

        <div className="space-y-3">
          {cards.map((item) => {
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
          Open owner view
        </button>
      </div>
    </div>
  );
}