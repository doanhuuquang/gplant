"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useInventoryStore } from "@/stores/inventory-store";
import { AdjustInventoryRequest } from "@/lib/schemas/inventory/adjust-inventory-request";
import { toast } from "sonner";

export function useAdjustInventory() {
  const { adjustInventory, isLoadingInventory } = useInventoryStore();

  const handleAdjustInventory = async (
    id: string,
    request: AdjustInventoryRequest,
  ) => {
    try {
      await adjustInventory(id, request);

      toast.success("Inventory adjusted", {
        description: "Inventory has been adjusted successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Adjust failed", {
        description: err.message ?? "Failed to adjust inventory.",
      });

      return false;
    }
  };

  return {
    handleAdjustInventory,
    isLoading: isLoadingInventory,
  };
}
