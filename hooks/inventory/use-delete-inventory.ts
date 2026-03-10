"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useInventoryStore } from "@/stores/inventory-store";
import { toast } from "sonner";

export function useDeleteInventory() {
  const { deleteInventory, isLoadingInventory } = useInventoryStore();

  const handleDeleteInventory = async (id: string) => {
    try {
      await deleteInventory(id);

      toast.success("Inventory deleted", {
        description: "Inventory has been deleted successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Delete failed", {
        description: err.message ?? "Failed to delete inventory.",
      });

      return false;
    }
  };

  return {
    handleDeleteInventory,
    isLoading: isLoadingInventory,
  };
}
