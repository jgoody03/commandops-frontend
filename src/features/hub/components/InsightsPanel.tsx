import { Link } from "react-router-dom";

export type HubInsight = {
  id: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  tone?: "blue" | "amber" | "rose" | "emerald";
};

type Props = {
  insights: HubInsight[];
};

function toneClasses(tone: HubInsight["tone"] = "blue") {
  switch (tone) {
    case "amber":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "rose":
      return "border-rose-200 bg-rose-50 text-rose-900";
    case "emerald":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    default:
      return "border-blue-200 bg-blue-50 text-blue-900";
  }
}

export default function InsightsPanel({ insights }: Props) {
  if (!insights.length) return null;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Insights</h2>
        <p className="text-sm text-slate-500">
          A quick read on what needs attention right now.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-xl border px-4 py-3 shadow-sm transition ${toneClasses(
              insight.tone
            )}`}
          >
            <div className="text-sm leading-6">{insight.message}</div>

            {insight.actionHref ? (
              <div className="mt-2">
                <Link
                  to={insight.actionHref}
                  className="text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  {insight.actionLabel ?? "Open"}
                </Link>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}