"use client";

import { useEffect } from "react";
import { useInventoryStore } from "@/stores/inventory-store";

export function useGetInventories() {
  const { inventories, isLoadingInventory, inventoryError, fetchInventories } =
    useInventoryStore();

  useEffect(() => {
    if (!inventories?.length) {
      fetchInventories();
    }
  }, [inventories?.length, fetchInventories]);

  return {
    inventories,
    isLoading: isLoadingInventory,
    inventoryError,
  };
}
