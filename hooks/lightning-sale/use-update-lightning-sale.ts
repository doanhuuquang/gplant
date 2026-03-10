"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useLightningSaleStore } from "@/stores/lightning-sale-store";
import { UpdateLightningSaleRequest } from "@/lib/schemas/lightning-sale/update-lightning-sale-request";
import { toast } from "sonner";

export function useUpdateLightningSale() {
  const { updateLightningSale, isLoadingLightningSale } =
    useLightningSaleStore();

  const handleUpdateLightningSale = async (
    id: string,
    request: UpdateLightningSaleRequest,
  ) => {
    try {
      await updateLightningSale(id, request);

      toast.success("Lightning sale updated", {
        description: "Lightning sale has been updated successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update lightning sale.",
      });

      return false;
    }
  };

  return {
    handleUpdateLightningSale,
    isLoading: isLoadingLightningSale,
  };
}
