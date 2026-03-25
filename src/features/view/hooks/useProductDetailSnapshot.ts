import { useEffect, useState } from "react";
import { getProductDetailSnapshot } from "../api/getProductDetailSnapshot";
import type { GetProductDetailSnapshotResponse } from "../types";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

type Options = {
  productId?: string;
  activityLimit?: number;
};

export function useProductDetailSnapshot(options?: Options) {
  const { workspaceId } = useWorkspaceContext();
  const productId = options?.productId;
  const activityLimit = options?.activityLimit ?? 10;

  const [data, setData] = useState<GetProductDetailSnapshotResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!workspaceId || !productId) return;

      setLoading(true);
      setError(null);

      try {
        const result = await getProductDetailSnapshot({
          workspaceId,
          productId,
          activityLimit,
        });

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [workspaceId, productId, activityLimit]);

  return {
    data,
    loading,
    error,
  };
}