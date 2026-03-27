import type { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRightLeft,
  ClipboardList,
  House,
  PackagePlus,
  SlidersHorizontal,
} from "lucide-react";
import { AppHeader } from "./AppHeader";
import { cn } from "@/lib/utils";

const navItems = [
  {
    to: "/ops",
    label: "Home",
    icon: House,
  },
  {
    to: "/ops/receive",
    label: "Receive",
    icon: PackagePlus,
  },
  {
    to: "/ops/move",
    label: "Move",
    icon: ArrowRightLeft,
  },
  {
    to: "/ops/adjust",
    label: "Adjust",
    icon: SlidersHorizontal,
  },
  {
    to: "/ops/count",
    label: "Count",
    icon: ClipboardList,
  },
];

type Props = PropsWithChildren<{
  title?: string;
  subtitle?: string;
}>;

export function OpsShell({ children, title, subtitle }: Props) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col">
        <div className="border-b border-gray-200 bg-white px-3 py-3 sm:px-4">
          <div className="flex flex-col gap-3">
            {(title || subtitle) && (
              <div>
                {title ? (
                  <h1 className="text-xl font-semibold text-gray-900">
                    {title}
                  </h1>
                ) : null}
                {subtitle ? (
                  <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                ) : null}
              </div>
            )}

            <div className="grid grid-cols-5 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.to ||
                  (item.to !== "/ops" && location.pathname.startsWith(item.to));

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex min-h-[72px] flex-col items-center justify-center rounded-2xl border px-2 py-2 text-center text-xs font-medium transition",
                      isActive
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <Icon size={18} />
                    <span className="mt-2">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <main className="flex-1 px-3 py-4 sm:px-4">{children}</main>
      </div>
    </div>
  );
}