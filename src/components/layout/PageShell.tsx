import type { PropsWithChildren } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export function PageShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl">
        <AppSidebar />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}