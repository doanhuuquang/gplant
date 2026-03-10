"use client";

import * as React from "react";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import InventoryResponse from "@/lib/schemas/inventory/inventory-response";
import { getInventoryOfVariant } from "@/services/inventory-service";

export function useGetPlantByVariant(variantId: string) {
  const [isLoadingInventoryByVariant, setIsLoadingInventoryByVariant] =
    React.useState<boolean>(false);
  const [getInventoryByVariantError, setGetInventoryByVariantError] =
    React.useState<string | null>(null);
  const [inventoryByVariant, setInventoryByVariant] =
    React.useState<InventoryResponse | null>(null);

  const fetchInventoryOfVariant = React.useCallback(async () => {
    if (!variantId) return;

    try {
      setInventoryByVariant(null);
      setIsLoadingInventoryByVariant(true);
      setGetInventoryByVariantError(null);

      const response = await getInventoryOfVariant(variantId);
      setInventoryByVariant(response.data as InventoryResponse);
    } catch (e) {
      const err = e as ApiErrorResponse;
      setGetInventoryByVariantError(err.message ?? "Failed to load plant.");
    } finally {
      setIsLoadingInventoryByVariant(false);
    }
  }, [variantId]);

  React.useEffect(() => {
    fetchInventoryOfVariant();
  }, [fetchInventoryOfVariant]);

  return {
    inventoryByVariant,
    isLoadingInventoryByVariant,
    getInventoryByVariantError,
    refetch: fetchInventoryOfVariant,
  };
}
