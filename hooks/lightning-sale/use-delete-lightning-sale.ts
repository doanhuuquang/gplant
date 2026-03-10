"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useLightningSaleStore } from "@/stores/lightning-sale-store";
import { toast } from "sonner";

export function useDeleteLightningSale() {
  const { deleteLightningSale, isLoadingLightningSale } =
    useLightningSaleStore();

  const handleDeleteLightningSale = async (id: string) => {
    try {
      await deleteLightningSale(id);

      toast.success("Lightning sale deleted", {
        description: "Lightning sale has been deleted successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Delete failed", {
        description: err.message ?? "Failed to delete lightning sale.",
      });

      return false;
    }
  };

  return {
    handleDeleteLightningSale,
    isLoading: isLoadingLightningSale,
  };
}
