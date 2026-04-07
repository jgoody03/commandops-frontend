import { useEffect, useState } from "react";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import {
  getVendorReceiveHistory,
  type GetVendorReceiveHistoryResponse,
} from "../api/getVendorReceiveHistory";

type UseVendorReceiveHistoryResult = {
  data: GetVendorReceiveHistoryResponse | null;
  loading: boolean;
  error: string | null;
};

export function useVendorReceiveHistory(
  vendorName: string | null,
  limit = 20
): UseVendorReceiveHistoryResult {
  const { workspaceId } = useWorkspaceContext();
  const [data, setData] = useState<GetVendorReceiveHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!workspaceId || !vendorName) {
        setData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getVendorReceiveHistory({
          workspaceId,
          vendorName,
          limit,
        });

        if (cancelled) return;
        setData(result);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Unable to load vendor history."
        );
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
  }, [workspaceId, vendorName, limit]);

  return { data, loading, error };
}