import { useEffect, useState } from "react";
import { getReceiveHistory, type ReceiveHistoryItem } from "../api/getReceiveHistory";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

type UseReceiveHistoryResult = {
  data: ReceiveHistoryItem[];
  loading: boolean;
  error: string | null;
};

export function useReceiveHistory(limit = 20): UseReceiveHistoryResult {
  const { workspaceId } = useWorkspaceContext();
  const [data, setData] = useState<ReceiveHistoryItem[]>([]);
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
        const result = await getReceiveHistory({
          workspaceId,
          limit,
        });

        if (cancelled) return;
        setData(result.items ?? []);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unable to load receive history.");
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