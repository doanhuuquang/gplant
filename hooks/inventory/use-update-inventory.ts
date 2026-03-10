"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useInventoryStore } from "@/stores/inventory-store";
import { UpdateInventoryRequest } from "@/lib/schemas/inventory/update-inventory-request";
import { toast } from "sonner";

export function useUpdateInventory() {
  const { updateInventory, isLoadingInventory } = useInventoryStore();

  const handleUpdateInventory = async (
    id: string,
    request: UpdateInventoryRequest,
  ) => {
    try {
      await updateInventory(id, request);

      toast.success("Inventory updated", {
        description: "Inventory has been updated successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update inventory.",
      });

      return false;
    }
  };

  return {
    handleUpdateInventory,
    isLoading: isLoadingInventory,
  };
}
