import { useMutation, useQueryClient } from "@tanstack/react-query";
import { receiveInventory } from "../api";

export function useReceiveInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: receiveInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todaySnapshot"] });
      queryClient.invalidateQueries({ queryKey: ["locationSummaryList"] });
      queryClient.invalidateQueries({ queryKey: ["lowStockProducts"] });
      queryClient.invalidateQueries({ queryKey: ["replenishmentRecommendations"] });
    },
  });
}