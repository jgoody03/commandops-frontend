import { useCallback, useEffect, useState } from "react";
import {
  getLocationSummaryList,
  type GetLocationSummaryListOutput,
  type SummaryListCursor,
} from "../api/getLocationSummaryList";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

type Options = {
  initialLimit?: number;
  initialQuery?: string;
};

export function useLocationSummaryList(options?: Options) {
  const { workspaceId } = useWorkspaceContext();

  const [data, setData] = useState<GetLocationSummaryListOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const [query, setQuery] = useState(options?.initialQuery ?? "");
  const limit = options?.initialLimit ?? 8;

  const loadFirstPage = useCallback(async () => {
    if (!workspaceId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getLocationSummaryList({
        workspaceId,
        limit,
        query: query.trim() || undefined,
        cursor: null,
      });

      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, limit, query]);

  const loadMore = useCallback(async () => {
    if (!workspaceId || !data?.nextCursor) return;

    setLoadingMore(true);
    setError(null);

    try {
      const result = await getLocationSummaryList({
        workspaceId,
        limit,
        query: query.trim() || undefined,
        cursor: data.nextCursor as SummaryListCursor,
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
  }, [workspaceId, data?.nextCursor, limit, query]);

  useEffect(() => {
    void loadFirstPage();
  }, [loadFirstPage]);

  return {
    data,
    loading,
    loadingMore,
    error,
    query,
    setQuery,
    reload: loadFirstPage,
    loadMore,
    hasMore: Boolean(data?.nextCursor),
  };
}