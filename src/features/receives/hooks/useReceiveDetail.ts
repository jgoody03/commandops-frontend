import { useEffect, useState } from "react";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";
import {
  getReceiveDetail,
  type GetReceiveDetailResponse,
} from "../api/getReceiveDetail";

type UseReceiveDetailResult = {
  data: GetReceiveDetailResponse | null;
  loading: boolean;
  error: string | null;
};

export function useReceiveDetail(
  transactionId: string | null
): UseReceiveDetailResult {
  const { workspaceId } = useWorkspaceContext();
  const [data, setData] = useState<GetReceiveDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!workspaceId || !transactionId) {
        setData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getReceiveDetail({
          workspaceId,
          transactionId,
        });

        if (cancelled) return;
        setData(result);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unable to load receive detail.");
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
  }, [workspaceId, transactionId]);

  return { data, loading, error };
}