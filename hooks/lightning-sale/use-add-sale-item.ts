"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useLightningSaleStore } from "@/stores/lightning-sale-store";
import { AddSaleItemRequest } from "@/lib/schemas/lightning-sale/add-sale-item-request";
import { toast } from "sonner";

export function useAddSaleItem() {
  const { addSaleItem, isLoadingLightningSale } = useLightningSaleStore();

  const handleAddSaleItem = async (
    saleId: string,
    request: AddSaleItemRequest,
  ) => {
    try {
      await addSaleItem(saleId, request);

      toast.success("Sale item added", {
        description: "Item has been added to the sale successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Add item failed", {
        description: err.message ?? "Failed to add item to sale.",
      });

      return false;
    }
  };

  return {
    handleAddSaleItem,
    isLoading: isLoadingLightningSale,
  };
}
