import { useState } from "react";
import { createLocation } from "../api/createLocation";
import { useWorkspaceContext } from "@/features/workspace/hooks/useWorkspaceContext";

export function useCreateLocation() {
  const { workspaceId } = useWorkspaceContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function submit(input: {
    name: string;
    code: string;
    type: string;
  }) {
    if (!workspaceId) {
      throw new Error("Workspace not available.");
    }

    setLoading(true);
    setError(null);

    try {
      return await createLocation({
        workspaceId,
        ...input,
      });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    submit,
    loading,
    error,
  };
}