import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import PublicHeader from "@/components/public/PublicHeader";

const starterFeatures = [
  "1 workspace",
  "Tablet dashboard",
  "Ops workflows",
  "Product and location management",
  "Owner mobile view",
  "Guided onboarding",
];

const proFeatures = [
  "Everything in Starter",
  "Multi-user support",
  "More locations",
  "Operational insights",
  "Replenishment recommendations",
  "Priority support",
];

const systemFeatures = [
  "Everything in Pro",
  "Tablet command center",
  "Handheld ops device",
  "Workspace pre-configured",
  "Device-ready setup flow",
  "Out-of-box launch experience",
];

function PricingCard({
  name,
  price,
  subtitle,
  features,
  ctaLabel,
  ctaTo,
  featured = false,
}: {
  name: string;
  price: string;
  subtitle: string;
  features: string[];
  ctaLabel: string;
  ctaTo: string;
  featured?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-6 shadow-sm",
        featured
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-900",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className={[
              "text-sm font-semibold uppercase tracking-[0.18em]",
              featured ? "text-slate-300" : "text-slate-500",
            ].join(" ")}
          >
            {name}
          </div>

          <div className="mt-3 text-3xl font-semibold tracking-tight">
            {price}
          </div>

          <p
            className={[
              "mt-3 text-sm leading-6",
              featured ? "text-slate-300" : "text-slate-600",
            ].join(" ")}
          >
            {subtitle}
          </p>
        </div>

        {featured ? (
          <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
            Most complete
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <div
              className={[
                "mt-0.5 rounded-full p-1",
                featured ? "bg-white/10" : "bg-slate-100",
              ].join(" ")}
            >
              <Check
                size={14}
                className={featured ? "text-white" : "text-slate-700"}
              />
            </div>
            <div
              className={[
                "text-sm leading-6",
                featured ? "text-slate-200" : "text-slate-700",
              ].join(" ")}
            >
              {feature}
            </div>
          </div>
        ))}
      </div>

      <Link
        to={ctaTo}
        className={[
          "mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition active:scale-[0.98]",
          featured
            ? "bg-white text-slate-900 hover:bg-slate-100"
            : "bg-slate-900 text-white hover:bg-slate-800",
        ].join(" ")}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10">
        <section className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Pricing
          </div>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-900">
            Simple pricing for modern stores.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            Start with software, or get the full system ready out of the box.
            StorePilot is built to grow from simple setup into a real operating
            system for your store.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <PricingCard
            name="Starter"
            price="$39/mo"
            subtitle="For small stores getting organized with a simple, modern inventory system."
            features={starterFeatures}
            ctaLabel="Create workspace"
            ctaTo="/signup"
          />

          <PricingCard
            name="Pro"
            price="$99/mo"
            subtitle="For stores that want tighter control, better visibility, and stronger daily workflows."
            features={proFeatures}
            ctaLabel="Start with Pro"
            ctaTo="/signup"
          />

          <PricingCard
            name="StorePilot System"
            price="Custom setup"
            subtitle="The full experience — hardware, software, and a ready-to-run setup flow."
            features={systemFeatures}
            ctaLabel="Get the system"
            ctaTo="/signup"
            featured
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Good to know
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              Start simple, expand when you’re ready.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Most stores can start with the core system and grow into more
              users, more locations, and more advanced workflows over time.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              If you want the full out-of-box experience, the StorePilot System
              package is designed to get your store moving faster with hardware
              and pre-configured setup.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 shadow-sm text-white">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
              Hardware bundle
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Open the box. Power on. Get to work.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The StorePilot System bundle is built around the idea that your
              store should be ready faster — with devices, setup, and workflows
              designed to feel prepared from day one.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Hardware packaging and final bundle pricing can be tailored to
              your setup as the system expands.
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Need help choosing?
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Start with what fits your store now.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              You do not need to figure everything out upfront. Start with the
              package that matches your workflow today and expand as your store
              grows.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
              >
                Create workspace
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
          StorePilot — the modern way to run a small store.
        </footer>
      </div>
    </div>
  );
}