import { useEffect, useState } from "react";
import { listVendors, type VendorListItem } from "../api/listVendors";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

type UseVendorsResult = {
  data: VendorListItem[];
  loading: boolean;
  error: string | null;
};

export function useVendors(limit = 20): UseVendorsResult {
  const { workspaceId } = useWorkspaceContext();
  const [data, setData] = useState<VendorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!workspaceId) {
        setData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await listVendors({
          workspaceId,
          limit,
        });

        if (cancelled) return;
        setData(result.items ?? []);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unable to load vendors.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [workspaceId, limit]);

  return { data, loading, error };
}