import { useEffect, useState } from "react";
import {
  getReplenishmentRecommendations,
  type GetReplenishmentRecommendationsOutput,
} from "../api/getReplenishmentRecommendations";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

type Options = {
  limit?: number;
};

export function useReplenishmentRecommendations(options?: Options) {
  const { workspaceId } = useWorkspaceContext();

  const [data, setData] =
    useState<GetReplenishmentRecommendationsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const limit = options?.limit ?? 6;

  useEffect(() => {
    if (!workspaceId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getReplenishmentRecommendations({ workspaceId, limit })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [workspaceId, limit]);

  return { data, loading, error };
}