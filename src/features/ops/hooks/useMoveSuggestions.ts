import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { useMutation } from "@tanstack/react-query";

export function useMoveSuggestions() {
  return useMutation({
    mutationFn: async (input: {
      workspaceId: string;
      productId: string;
    }) => {
      const fn = httpsCallable(functions, "getMoveSuggestions");
      const res = await fn(input);
      return res.data as {
        sourceLocationId: string | null;
        targetLocationId: string | null;
        reason: string | null;
      };
    },
  });
}
