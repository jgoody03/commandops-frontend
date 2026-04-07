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
      return "border-sky-200 bg-sky-50 text-sky-900";
  }
}

function pulseDotClass(tone: HubInsight["tone"] = "blue") {
  switch (tone) {
    case "amber":
      return "bg-amber-500";
    case "rose":
      return "bg-rose-500";
    case "emerald":
      return "bg-emerald-500";
    default:
      return "bg-sky-500";
  }
}

export default function InsightsPanel({ insights }: Props) {
  if (!insights.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Live insights
        </div>
        <div className="mt-1 text-sm text-slate-600">
          What needs your attention right now.
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-2xl border px-4 py-4 transition hover:shadow-sm ${toneClasses(
              insight.tone
            )}`}
          >
            <div className="flex items-start gap-3">
              {/* 🔥 Pulse dot */}
              <span className="relative mt-1 flex h-2.5 w-2.5">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${pulseDotClass(
                    insight.tone
                  )}`}
                />
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${pulseDotClass(
                    insight.tone
                  )}`}
                />
              </span>

              <div className="flex-1">
                <div className="text-sm leading-6">
                  {insight.message}
                </div>

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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}