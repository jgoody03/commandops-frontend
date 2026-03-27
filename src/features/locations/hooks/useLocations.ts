import { useCallback, useEffect, useState } from "react";
import {
  getLocations,
  type GetLocationsResponse,
} from "../api/getLocations";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

export function useLocations() {
  const { workspaceId } = useWorkspaceContext();

  const [data, setData] = useState<GetLocationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    if (!workspaceId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getLocations({ workspaceId });
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    data,
    loading,
    error,
    reload: load,
  };
}