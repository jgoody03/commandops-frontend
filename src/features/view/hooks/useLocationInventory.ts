import { useCallback, useEffect, useState } from "react";
import {
  getLocationInventory,
} from "../api/getLocationInventory";
import type {
  GetLocationInventoryCursor,
  GetLocationInventoryResponse,
} from "../types";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

type Options = {
  locationId?: string;
  initialLimit?: number;
};

export function useLocationInventory(options?: Options) {
  const { workspaceId } = useWorkspaceContext();
  const locationId = options?.locationId;
  const limit = options?.initialLimit ?? 50;

  const [data, setData] = useState<GetLocationInventoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const loadFirstPage = useCallback(async () => {
    if (!workspaceId || !locationId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getLocationInventory({
        workspaceId,
        locationId,
        limit,
        cursor: null,
      });

      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, locationId, limit]);

  const loadMore = useCallback(async () => {
    if (!workspaceId || !locationId || !data?.nextCursor) return;

    setLoadingMore(true);
    setError(null);

    try {
      const result = await getLocationInventory({
        workspaceId,
        locationId,
        limit,
        cursor: data.nextCursor as GetLocationInventoryCursor,
      });

      setData((prev) => ({
        items: [...(prev?.items ?? []), ...result.items],
        nextCursor: result.nextCursor,
      }));
    } catch (err) {
      setError(err);
    } finally {
      setLoadingMore(false);
    }
  }, [workspaceId, locationId, data?.nextCursor, limit]);

  useEffect(() => {
    void loadFirstPage();
  }, [loadFirstPage]);

  return {
    data,
    loading,
    loadingMore,
    error,
    reload: loadFirstPage,
    loadMore,
    hasMore: Boolean(data?.nextCursor),
  };
}