import { useCallback, useEffect, useState } from "react";
import {
  getLocationOptions,
  type GetLocationOptionsResponse,
} from "../api/getLocationOptions";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

export function useLocationOptions() {
  const { workspaceId } = useWorkspaceContext();

  const [data, setData] = useState<GetLocationOptionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    if (!workspaceId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getLocationOptions({ workspaceId });
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