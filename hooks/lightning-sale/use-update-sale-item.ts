"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useLightningSaleStore } from "@/stores/lightning-sale-store";
import { UpdateSaleItemRequest } from "@/lib/schemas/lightning-sale/update-sale-item-request";
import { toast } from "sonner";

export function useUpdateSaleItem() {
  const { updateSaleItem, isLoadingLightningSale } = useLightningSaleStore();

  const handleUpdateSaleItem = async (
    itemId: string,
    request: UpdateSaleItemRequest,
  ) => {
    try {
      await updateSaleItem(itemId, request);

      toast.success("Sale item updated", {
        description: "Sale item has been updated successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update item failed", {
        description: err.message ?? "Failed to update sale item.",
      });

      return false;
    }
  };

  return {
    handleUpdateSaleItem,
    isLoading: isLoadingLightningSale,
  };
}
