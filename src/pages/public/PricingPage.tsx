import { Link } from "react-router-dom";
import { Check, Apple } from "lucide-react";
import PublicHeader from "@/components/public/PublicHeader";
import StorePilotLogo from "@/components/branding/StorePilotLogo";

const coreFeatures = [
  "1 workspace",
  "Unlimited products & inventory",
  "Dashboard and owner view",
  "Receiving, move, count, and adjust workflows",
  "Locations and product management",
  "Barcode scanning workflows",
  "Multi-user support",
  "Replenishment insights",
  "Guided onboarding",
];

function IncludedItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-full bg-slate-100 p-1">
        <Check size={14} className="text-slate-700" />
      </div>
      <div className="text-sm leading-6 text-slate-700">{children}</div>
    </div>
  );
}

function HardwareCard({
  title,
  body,
  note,
}: {
  title: string;
  body: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
      {note ? (
        <div className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
          {note}
        </div>
      ) : null}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10 md:px-6">
        <section className="max-w-3xl">
          <div className="flex items-center gap-3">
            <StorePilotLogo size="sm" showWordmark={false} />
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Pricing
            </div>
          </div>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-900">
            Start simple. Expand when you’re ready.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            StorePilot starts with one calm, live software system for your store.
            Add dedicated hardware later as your workflow grows.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-slate-900 bg-slate-900 p-6 shadow-sm text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                  StorePilot
                </div>

                <div className="mt-3 text-4xl font-semibold tracking-tight">
                  $59/mo
                </div>

                <div className="mt-2 text-sm font-medium text-cyan-300">
                  14-day free trial
                </div>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                  Everything you need to run your store in one calm, live system.
                </p>
              </div>

              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                Core plan
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {coreFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-white/10 p-1">
                    <Check size={14} className="text-white" />
                  </div>
                  <div className="text-sm leading-6 text-slate-200">
                    {feature}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
              >
                Start free trial
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Good to know
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              Get your store live first.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              The goal is not to configure everything upfront. Start with your
              workspace, add a few locations and products, and begin using the
              system right away.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Once your store is running inside StorePilot, you can expand with
              dedicated hardware for a faster, more specialized setup.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Best for:
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600">
                Small stores, growing resellers, and operators who want live
                inventory control without a bloated system.
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Expand your system
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Add hardware when your workflow needs it.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Start with software, then add dedicated devices to make scanning,
              visibility, and daily operations even faster.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                <Apple size={15} />
                <span>Compatible with iPad</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                <span className="text-base leading-none">🤖</span>
                <span>Compatible with Android tablets</span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <HardwareCard
              title="Command Center Tablet"
              body="A dedicated dashboard screen for inventory health, sales visibility, alerts, and daily store oversight."
              note="Optional hardware add-on"
            />

            <HardwareCard
              title="Handheld Scanner"
              body="A faster scanning workflow for stores that need higher-volume receiving, counting, and inventory movement."
              note="Optional hardware add-on"
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              How most stores start
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              Software first. Hardware later.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Many stores begin with the core StorePilot software, use their
              existing devices, and then add a dedicated tablet or handheld once
              the workflow is proven.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              That keeps setup simple and gives you flexibility as your store
              grows.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 shadow-sm text-white">
            <div className="flex items-center gap-3">
              <StorePilotLogo inverted size="sm" showWordmark={false} />
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                Trial
              </div>
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              14 days to get your store live.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Add your workspace, set your first locations, load a few products,
              and start using the system the way your store actually works.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Once your inventory is live, StorePilot becomes much harder to
              walk away from — and that is exactly the point.
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Need help choosing?
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Start with what fits your store today.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              You do not need to figure everything out upfront. Start with the
              software, get your store live, and expand your system when it
              makes sense.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
              >
                Start free trial
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
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