import { PageShell } from "../../components/layout/PageShell";

export default function OpsHomePage() {
  return (
    <PageShell>
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          Ops
        </div>
        <h1 className="mt-1 text-3xl font-semibold text-gray-900">
          In-store workflows
        </h1>
      </div>
    </PageShell>
  );
}