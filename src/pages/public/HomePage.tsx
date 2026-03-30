import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Hand,
  PackageCheck,
  TabletSmartphone,
} from "lucide-react";
import PublicHeader from "@/components/public/PublicHeader";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Store operations, made simple
            </div>

            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-900">
              Run your store without the chaos.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              StorePilot gives small stores and resellers a simple system to
              track inventory, run daily operations, and stay organized —
              across tablet, handheld, and mobile.
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

            <p className="mt-4 text-xs text-slate-500">
              Start on the web now, or finish setup later on your shipped
              device.
            </p>

            <p className="mt-6 text-sm leading-6 text-slate-500">
              Built for small stores, growing resellers, and modern operators
              who want simple tools that actually get used.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <TabletSmartphone size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      Command center
                    </div>
                    <div className="text-sm text-slate-500">
                      Dashboard for inventory health and daily oversight.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <Hand size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      Handheld workflows
                    </div>
                    <div className="text-sm text-slate-500">
                      Receive, move, adjust, and count with less friction.
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      Owner visibility
                    </div>
                    <div className="text-sm text-slate-500">
                      A clean snapshot of what needs attention.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="font-semibold text-slate-900">Ready fast</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Set up your workspace, power on your device, and start working in
              minutes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="font-semibold text-slate-900">
              Built for real work
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use the tablet as your command center and the handheld for fast
              day-to-day inventory tasks.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="font-semibold text-slate-900">
              Simple for small business
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              No bloated system. No stuffy workflows. Just the tools you
              actually need.
            </p>
          </div>
        </section>

        <section>
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              One system. Three ways to run your business.
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Built around how real stores actually work.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <TabletSmartphone size={22} />
              <div className="mt-4 font-semibold text-slate-900">Tablet</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your store command center for inventory health, alerts, and
                daily oversight.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <PackageCheck size={22} />
              <div className="mt-4 font-semibold text-slate-900">Handheld</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Fast task-focused tools for receiving, moving, adjusting, and
                counting inventory.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <BarChart3 size={22} />
              <div className="mt-4 font-semibold text-slate-900">
                Owner view
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A simple business snapshot that helps you see what needs
                attention quickly.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Better control, better visibility
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Stop relying on periodic inventory checks.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Many small stores only get a clear inventory picture once in a
              while — often through outside services, manual counts, or reactive
              cleanup after something goes wrong.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              StorePilot helps you move from periodic snapshots to continuous
              inventory control built into the way your store already works.
            </p>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="font-medium text-slate-900">
                Less guesswork. More control.
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep a closer handle on stock, reduce surprises, and make better
                decisions without depending on a once-in-a-while inventory
                check.
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
                <li>Outside services or manual counts</li>
                <li>Expensive over time</li>
                <li>Gaps between counts</li>
                <li>Problems found too late</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-sm text-white">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
                StorePilot
              </div>
              <h3 className="mt-3 text-lg font-semibold">
                Continuous inventory control
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>Track inventory as it moves</li>
                <li>Built into daily workflows</li>
                <li>Always know what’s happening</li>
                <li>Fewer surprises, better decisions</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Out of the box
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Open the box. Power on. Get to work.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              StorePilot isn’t just software. Your workspace can be prepared
              ahead of time so when your device arrives, you’re ready to go.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              No complicated setup. No long handoff. Just a system that’s ready
              when you are.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-semibold text-slate-900">
                Workspace prepared
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your store setup can be created before your first session.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-semibold text-slate-900">
                Devices ready to sign in
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tablet and handheld flows are built to feel ready from day one.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-semibold text-slate-900">
                Guided first setup
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Step-by-step onboarding gets your locations and products in place fast.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-semibold text-slate-900">
                Start scanning immediately
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Begin receiving and organizing inventory without a heavy lift.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Built for real store work
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Designed for the way inventory actually moves.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              From receiving shipments to counting shelves, StorePilot is built
              around the real tasks store owners and operators do every day.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-semibold text-slate-900">
                Receiving inventory
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Bring products into the system quickly and accurately.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-semibold text-slate-900">
                Moving stock
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Track inventory across locations without losing visibility.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-semibold text-slate-900">
                Counts and adjustments
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep balances accurate as inventory changes in the real world.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-semibold text-slate-900">
                Shelf organization
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Build the foundation for barcode labels, better organization,
                and faster store workflows.
              </p>
            </div>
          </div>
        </section>

        <section id="how-it-works">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              How it works
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              Get started without the usual mess.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-500">01</div>
              <div className="mt-3 font-semibold text-slate-900">
                Create your workspace
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Set up your store and account in a few minutes.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-500">02</div>
              <div className="mt-3 font-semibold text-slate-900">
                Add your locations and products
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Start simple, then build your system as you go.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-500">03</div>
              <div className="mt-3 font-semibold text-slate-900">
                Start running your store
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use the dashboard, handheld workflows, and owner view right
                away.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-slate-900 px-6 py-10 text-white">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold tracking-tight">
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
          StorePilot — the modern way to run a small store.
        </footer>
      </div>
    </div>
  );
}