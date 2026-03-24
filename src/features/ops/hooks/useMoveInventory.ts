import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveInventory } from "../api";

export function useMoveInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moveInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todaySnapshot"] });
      queryClient.invalidateQueries({ queryKey: ["locationSummaryList"] });
      queryClient.invalidateQueries({ queryKey: ["lowStockProducts"] });
      queryClient.invalidateQueries({ queryKey: ["replenishmentRecommendations"] });
    },
  });
}