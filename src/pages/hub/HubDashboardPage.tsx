import { PageShell } from "../../components/layout/PageShell";
import { Card } from "../../components/ui/Card";
import { LoadingState } from "../../components/ui/LoadingState";
import { useTodaySnapshot } from "../../features/dashboard/hooks";
import { useMyWorkspaceContext } from "../../features/workspace/hooks";

export default function HubDashboardPage() {
  const {
    data: workspace,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useMyWorkspaceContext();

  const workspaceId = workspace?.workspaceId;

  const {
    data,
    isLoading: snapshotLoading,
    error: snapshotError,
  } = useTodaySnapshot(workspaceId);

  const isLoading = workspaceLoading || snapshotLoading;
  const error = workspaceError || snapshotError;

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
          {workspaceId ? (
            <p className="mt-1 text-xs text-gray-400">
              Workspace: {workspaceId}
            </p>
          ) : null}
        </div>

        {isLoading && <LoadingState label="Loading dashboard..." />}

        {error && (
          <Card className="text-red-600">
            <div className="font-semibold">Failed to load dashboard data</div>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs">
              {error instanceof Error ? error.message : JSON.stringify(error, null, 2)}
            </pre>
          </Card>
        )}

        {data && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <div className="text-sm text-gray-500">Products</div>
              <div className="mt-2 text-2xl font-semibold">
                {data.totalProducts}
              </div>
            </Card>

            <Card>
              <div className="text-sm text-gray-500">Locations</div>
              <div className="mt-2 text-2xl font-semibold">
                {data.totalLocations}
              </div>
            </Card>

            <Card>
              <div className="text-sm text-gray-500">Units</div>
              <div className="mt-2 text-2xl font-semibold">
                {data.totalUnits}
              </div>
            </Card>

            <Card>
              <div className="text-sm text-gray-500">Low Stock</div>
              <div className="mt-2 text-2xl font-semibold text-red-600">
                {data.lowStockCount}
              </div>
            </Card>
          </div>
        )}
      </div>
    </PageShell>
  );
}