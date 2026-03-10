"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useLightningSaleStore } from "@/stores/lightning-sale-store";
import { toast } from "sonner";

export function useDeactivateLightningSale() {
  const { deactivateLightningSale, isLoadingLightningSale } =
    useLightningSaleStore();

  const handleDeactivateLightningSale = async (id: string) => {
    try {
      await deactivateLightningSale(id);

      toast.success("Lightning sale deactivated", {
        description: "Lightning sale has been deactivated successfully.",
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Deactivation failed", {
        description: err.message ?? "Failed to deactivate lightning sale.",
      });
    }
  };

  return {
    handleDeactivateLightningSale,
    isLoading: isLoadingLightningSale,
  };
}
