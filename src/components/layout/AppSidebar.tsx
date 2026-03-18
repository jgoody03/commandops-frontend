import { NavLink } from "react-router-dom";
import { Eye, LayoutDashboard, Smartphone } from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  {
    to: "/hub/dashboard",
    label: "Hub",
    icon: LayoutDashboard,
  },
  {
    to: "/ops",
    label: "Ops",
    icon: Smartphone,
  },
  {
    to: "/view",
    label: "View",
    icon: Eye,
  },
];

export function AppSidebar() {
  return (
    <aside className="hidden w-64 border-r border-gray-200 bg-white lg:block">
      <div className="p-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
          Modes
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}