import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  PackageCheck,
  ScanLine,
  Sparkles,
  TabletSmartphone,
  Zap,
} from "lucide-react";
import PublicHeader from "@/components/public/PublicHeader";
import StorePilotLogo from "@/components/branding/StorePilotLogo";
function PulseDot({
  className = "bg-sky-500",
}: {
  className?: string;
}) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${className}`}
      />
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${className}`}
      />
    </span>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      {children}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        <Icon size={20} />
      </div>
      <div className="mt-4 text-base font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-400">{step}</div>
      <div className="mt-3 text-lg font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function PulseMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "primary" | "warning";
}) {
  const cardClass =
    tone === "primary"
      ? "border-slate-900 bg-slate-900 text-white"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-slate-900"
        : "border-slate-200 bg-white text-slate-900";

  const labelClass =
    tone === "primary" ? "text-slate-300" : "text-slate-500";

  const valueClass =
    tone === "primary" ? "text-white" : "text-slate-900";

  return (
    <div className={`rounded-2xl border px-4 py-4 shadow-sm ${cardClass}`}>
      <div className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${labelClass}`}>
        {label}
      </div>
      <div className={`mt-2 text-xl font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}

function LivePreviewCard() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-50 to-transparent" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PulseDot />
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                StorePilot Live
              </div>
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              Today at a glance
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
            Command Center
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <PulseMetric label="Sales Today" value="$482.40" tone="primary" />
          <PulseMetric label="Units Sold" value="32" />
          <PulseMetric label="Attention" value="3 items" tone="warning" />
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <PulseDot className="bg-cyan-500" />
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Sales signal
                </div>
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                $482.40
              </div>
              <div className="mt-1 text-sm text-slate-600">
                32 units sold across 14 transactions
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
            <svg viewBox="0 0 294 80" className="h-20 w-full">
              <defs>
                <linearGradient id="homePulseLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>

              <path d="M0 70 H294" stroke="#e2e8f0" strokeWidth="1" fill="none" />
              <polyline
                fill="none"
                stroke="url(#homePulseLine)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,58 42,52 84,44 126,38 168,28 210,34 252,22 294,18"
                className="drop-shadow-[0_0_6px_rgba(14,165,233,0.18)]"
              />
              {[58, 52, 44, 38, 28, 34, 22, 18].map((y, index) => (
                <circle
                  key={index}
                  cx={index * 42}
                  cy={y}
                  r="3.5"
                  fill="#0ea5e9"
                />
              ))}
            </svg>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <PulseDot />
              <div>
                <div className="text-sm font-medium text-sky-900">
                  Move 6 units from backroom to front
                </div>
                <div className="mt-1 text-sm text-sky-700">
                  StorePilot detected a faster sell-through at the floor location.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <PulseDot className="bg-emerald-500" />
              <div>
                <div className="text-sm font-medium text-emerald-900">
                  Scan → sell → inventory updates instantly
                </div>
                <div className="mt-1 text-sm text-emerald-700">
                  One calm workflow across mobile, tablet, and handheld.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-sky-100 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-cyan-100 blur-3xl" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 py-10 md:px-6">
        <section className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <PulseDot />
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Store operations, made simple
              </div>
            </div>

            <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              See your entire store in one calm, live view.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              StorePilot helps small stores track inventory, run daily
              operations, and stay organized without the usual clutter, chaos,
              or bloated systems.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
              >
                Create workspace
                <ArrowRight size={16} />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
              >
                See how it works
              </a>
            </div>
<div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
    <span className="h-2 w-2 rounded-full bg-emerald-500" />
    14-day free trial
  </div>

  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
    No heavy setup
  </div>

  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
    Start running your store fast
  </div>
</div>

            <div className="mt-6 text-sm text-slate-500">
              Start on the web now, or finish setup later on your shipped device.
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <PulseMetric label="Always Live" value="Inventory in motion" />
              <PulseMetric label="Simple Setup" value="Ready fast" />
              <PulseMetric label="StorePilot" value="Calm control" tone="primary" />
            </div>
          </div>

          <LivePreviewCard />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionEyebrow>Why it feels different</SectionEyebrow>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                Not another dashboard. A store operating system.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                StorePilot is built to feel clear, responsive, and easy to trust.
                It helps owners see what matters, act quickly, and keep inventory
                under control without digging through busy screens.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={Sparkles}
                title="Calm by design"
                body="Minimal screens, clear hierarchy, and just enough guidance."
              />
              <FeatureCard
                icon={Zap}
                title="Live signals"
                body="Sales, stock changes, and attention items surface as they happen."
              />
              <FeatureCard
                icon={Boxes}
                title="Built for real stores"
                body="Receiving, counting, moving, and selling all connect in one flow."
              />
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-2xl">
            <SectionEyebrow>One system. Three ways to run your store.</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Built around how real inventory work actually happens.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={TabletSmartphone}
              title="Command Center"
              body="A clean dashboard for sales, inventory health, and store attention."
            />
            <FeatureCard
              icon={PackageCheck}
              title="Handheld workflows"
              body="Receive, move, count, and adjust inventory with less friction."
            />
            <FeatureCard
              icon={BarChart3}
              title="Owner visibility"
              body="See what needs action quickly without drowning in reports."
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <SectionEyebrow>Better control, better visibility</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Most stores only see inventory occasionally. StorePilot makes it continuous.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Instead of relying on manual cleanup, outside counts, or delayed
              reporting, StorePilot keeps inventory tied to the actual work your
              store is doing every day.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-medium text-slate-900">
                Less guesswork. More control.
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Fewer surprises, cleaner decisions, and a store that feels easier
                to run.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                Old way
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                Periodic inventory checks
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Manual counts or outside services</li>
                <li>Expensive over time</li>
                <li>Gaps between visibility</li>
                <li>Problems found too late</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-sm text-white">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                <PulseDot className="bg-cyan-400" />
                StorePilot
              </div>
              <h3 className="mt-3 text-lg font-semibold">
                Continuous inventory control
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>Track inventory as it moves</li>
                <li>Built into daily workflows</li>
                <li>Always know what’s happening</li>
                <li>Act before issues grow</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-2xl">
            <SectionEyebrow>Out of the box</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Open the box. Power on. Get to work.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              StorePilot is designed to feel ready from day one. Start simple,
              then build your system as you go.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <FeatureCard
              icon={Sparkles}
              title="Workspace prepared"
              body="Your store setup can begin before your first real session."
            />
            <FeatureCard
              icon={TabletSmartphone}
              title="Devices ready"
              body="Tablet and handheld flows are designed to feel familiar fast."
            />
            <FeatureCard
              icon={Boxes}
              title="Guided setup"
              body="Locations and first products can be added without a heavy lift."
            />
            <FeatureCard
              icon={ScanLine}
              title="Start scanning"
              body="Get inventory live fast, then continue building from inside your workspace."
            />
          </div>
        </section>

        <section id="how-it-works">
          <div className="max-w-2xl">
            <SectionEyebrow>How it works</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Get started without the usual mess.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StepCard
              step="01"
              title="Create your workspace"
              body="Start with your store name and a simple setup flow."
            />
            <StepCard
              step="02"
              title="Add your first locations and items"
              body="Set a basic foundation, then keep building from inside the system."
            />
            <StepCard
              step="03"
              title="Start running your store"
              body="Receive stock, scan products, and open your command center right away."
            />
          </div>
        </section>

        <section className="rounded-3xl bg-slate-900 px-6 py-10 text-white">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <PulseDot className="bg-cyan-400" />
<div className="flex items-center gap-3">
  <StorePilotLogo inverted size="sm" />
</div>
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Run your store the modern way.
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Start with a simple setup flow and build a system that actually
              keeps up with your business.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100 active:scale-[0.98]"
              >
                Create workspace
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          StorePilot — calm control for modern small stores.
        </footer>
      </div>
    </div>
  );
}