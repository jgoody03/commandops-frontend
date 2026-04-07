import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PageShell } from "../../components/layout/PageShell";
import { Card } from "../../components/ui/Card";
import { LoadingState } from "../../components/ui/LoadingState";
import { useTodaySnapshot } from "../../features/hub/hooks/useTodaySnapshot";
import { bootstrapWorkspace } from "../../features/workspace/bootstrap";
import { useMyWorkspaceContext } from "../../features/workspace/hooks";
import { seedDemoData } from "../../features/dev/seed";

export default function HubDashboardPage() {
  const queryClient = useQueryClient();

  const [workspaceIdInput, setWorkspaceIdInput] = useState("demo-store");
  const [workspaceName, setWorkspaceName] = useState("My CommandOps Workspace");
  const [bootstrapping, setBootstrapping] = useState(false);
  const [bootstrapError, setBootstrapError] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [seedError, setSeedError] = useState("");
  

  const {
    data: workspace,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useMyWorkspaceContext();

  const workspaceId =
    (workspace as { workspaceId?: string | null } | undefined)?.workspaceId ??
    undefined;

const {
  data: snapshot,
  loading: snapshotLoading,
  error: snapshotError,
} = useTodaySnapshot(workspaceId);

  async function handleBootstrap() {
    setBootstrapping(true);
    setBootstrapError("");

    try {
      await bootstrapWorkspace({
        workspaceId: workspaceIdInput.trim(),
        workspaceName: workspaceName.trim(),
      });

      await queryClient.invalidateQueries({ queryKey: ["workspaceContext"] });
      await queryClient.invalidateQueries({ queryKey: ["todaySnapshot"] });
    } catch (error) {
      setBootstrapError(
        error instanceof Error ? error.message : "Failed to create workspace"
      );
    } finally {
      setBootstrapping(false);
    }
  }

  async function handleSeedDemoData() {
    if (!workspaceId) return;

    setSeeding(true);
    setSeedError("");

    try {
      await seedDemoData(workspaceId);
      await queryClient.invalidateQueries({ queryKey: ["todaySnapshot"] });
    } catch (error) {
      setSeedError(
        error instanceof Error ? error.message : "Failed to seed demo data"
      );
    } finally {
      setSeeding(false);
    }
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Hub
          </div>
          <h1 className="mt-1 text-3xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Live system snapshot from CommandOps backend.
          </p>
        </div>

        {workspaceLoading && <LoadingState label="Loading workspace..." />}

        {workspaceError && (
          <Card className="text-red-600">
            <div className="font-semibold">Failed to load workspace context</div>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">
              {workspaceError instanceof Error
                ? workspaceError.message
                : JSON.stringify(workspaceError, null, 2)}
            </pre>
          </Card>
        )}

        {!workspaceLoading && !workspaceId && (
          <Card className="max-w-xl">
            <div className="text-lg font-semibold text-gray-900">
              Set up your workspace
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Your account is signed in, but it is not attached to a CommandOps
              workspace yet.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Workspace ID
                </label>
                <input
                  type="text"
                  value={workspaceIdInput}
                  onChange={(e) => setWorkspaceIdInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                  placeholder="demo-store"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use a simple unique ID such as your store name in lowercase
                  with dashes.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Workspace name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
                />
              </div>

              {bootstrapError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {bootstrapError}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleBootstrap}
                disabled={
                  bootstrapping || !workspaceIdInput.trim() || !workspaceName.trim()
                }
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bootstrapping ? "Creating workspace..." : "Create workspace"}
              </button>
            </div>
          </Card>
        )}

        {workspaceId && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSeedDemoData}
              disabled={seeding}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {seeding ? "Seeding demo data..." : "Seed Demo Data"}
            </button>

            {seedError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {seedError}
              </div>
            ) : null}
          </div>
        )}

        {workspaceId && snapshotLoading && (
          <LoadingState label="Loading dashboard..." />
        )}

{workspaceId && !!snapshotError && (
  <Card className="text-red-600">
    <div className="font-semibold">Failed to load dashboard data</div>
    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">
      {snapshotError instanceof Error
        ? snapshotError.message
        : JSON.stringify(snapshotError, null, 2)}
    </pre>
  </Card>
)}
        {workspaceId && snapshot && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <div className="text-sm text-gray-500">Products</div>
                <div className="mt-2 text-2xl font-semibold">
                  {snapshot.totals.totalProducts}
                </div>
              </Card>

              <Card>
                <div className="text-sm text-gray-500">Locations</div>
                <div className="mt-2 text-2xl font-semibold">
                  {snapshot.totals.totalLocations}
                </div>
              </Card>

              <Card>
                <div className="text-sm text-gray-500">Units</div>
                <div className="mt-2 text-2xl font-semibold">
                  {snapshot.totals.totalUnits}
                </div>
              </Card>

              <Card>
                <div className="text-sm text-gray-500">Low Stock</div>
                <div className="mt-2 text-2xl font-semibold text-red-600">
                  {snapshot.totals.lowStockProducts}
                </div>
              </Card>
            </div>

<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
  <Card>
    <div className="text-sm text-gray-500">Receipts Today</div>
    <div className="mt-2 text-2xl font-semibold">
      {snapshot.activity.receiveCount}
    </div>
  </Card>

  <Card>
    <div className="text-sm text-gray-500">Moves Today</div>
    <div className="mt-2 text-2xl font-semibold">
      {snapshot.activity.moveCount}
    </div>
  </Card>

  <Card>
    <div className="text-sm text-gray-500">Adjustments Today</div>
    <div className="mt-2 text-2xl font-semibold">
      {snapshot.activity.adjustCount}
    </div>
  </Card>

  <Card>
    <div className="text-sm text-gray-500">Sales Today</div>
    <div className="mt-2 text-2xl font-semibold">
      ${snapshot.sales.salesTodayRevenue.toFixed(2)}
    </div>
  </Card>

  <Card>
    <div className="text-sm text-gray-500">Units Sold Today</div>
    <div className="mt-2 text-2xl font-semibold">
      {snapshot.sales.unitsSoldToday}
    </div>
  </Card>

  <Card>
    <div className="text-sm text-gray-500">Sale Transactions</div>
    <div className="mt-2 text-2xl font-semibold">
      {snapshot.sales.salesTodayCount}
    </div>
  </Card>
</div>
          </div>
        )}
      </div>
    </PageShell>
  );
}