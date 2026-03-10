"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useLightningSaleStore } from "@/stores/lightning-sale-store";
import { toast } from "sonner";

export function useRemoveSaleItem() {
  const { removeSaleItem, isLoadingLightningSale } = useLightningSaleStore();

  const handleRemoveSaleItem = async (itemId: string) => {
    try {
      await removeSaleItem(itemId);

      toast.success("Sale item removed", {
        description: "Item has been removed from the sale successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Remove item failed", {
        description: err.message ?? "Failed to remove sale item.",
      });

      return false;
    }
  };

  return {
    handleRemoveSaleItem,
    isLoading: isLoadingLightningSale,
  };
}
