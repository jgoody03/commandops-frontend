import { Link } from "react-router-dom";
import {
  ArrowRightLeft,
  ClipboardList,
  PackagePlus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { OpsShell } from "@/components/layout/OpsShell";

const primaryActions = [
  {
    title: "Receive",
    description: "Add stock into a location after delivery or restock.",
    to: "/ops/receive",
    icon: PackagePlus,
  },
  {
    title: "Move",
    description: "Transfer stock between locations quickly.",
    to: "/ops/move",
    icon: ArrowRightLeft,
  },
  {
    title: "Count",
    description: "Verify physical quantity and reconcile inventory.",
    to: "/ops/count",
    icon: ClipboardList,
  },
  {
    title: "Adjust",
    description: "Correct a balance with a direct increase or decrease.",
    to: "/ops/adjust",
    icon: SlidersHorizontal,
  },
];

const quickLinks = [
  {
    label: "Review products",
    to: "/view/products",
  },
  {
    label: "Open dashboard",
    to: "/hub",
  },
  {
    label: "Open workspace view",
    to: "/view",
  },
];

export default function OpsHomePage() {
  return (
    <OpsShell
      title="Ops Home"
      subtitle="Start the next inventory task quickly."
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-gray-900 p-3 text-white">
              <Search size={20} />
            </div>

            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                Handheld Guidance
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                Scan first. Confirm quickly. Move to the next task.
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Use Receive for inbound stock, Move for transfers, Count for
                physical verification, and Adjust when you need to correct a
                balance directly.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {primaryActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.to}
                to={action.to}
                className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-gray-100 p-3 text-gray-900 transition group-hover:bg-gray-900 group-hover:text-white">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xl font-semibold text-gray-900">
                      {action.title}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {action.description}
                    </p>
                    <div className="mt-4 text-sm font-medium text-blue-600">
                      Open {action.title.toLowerCase()} workflow
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Quick access</h2>

          <div className="mt-3 flex flex-col gap-3">
            {quickLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-blue-600 transition hover:bg-gray-50 hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </OpsShell>
  );
}