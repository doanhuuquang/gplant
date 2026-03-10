"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useInventoryStore } from "@/stores/inventory-store";
import { CreateInventoryRequest } from "@/lib/schemas/inventory/create-inventory-request";
import { toast } from "sonner";

export function useCreateInventory() {
  const { createInventory, isLoadingInventory } = useInventoryStore();

  const handleCreateInventory = async (request: CreateInventoryRequest) => {
    try {
      await createInventory(request);

      toast.success("Inventory created", {
        description: "Inventory has been created successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Create failed", {
        description: err.message ?? "Failed to create inventory.",
      });

      return false;
    }
  };

  return {
    handleCreateInventory,
    isLoading: isLoadingInventory,
  };
}
