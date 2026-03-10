"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useLightningSaleStore } from "@/stores/lightning-sale-store";
import { toast } from "sonner";

export function useActivateLightningSale() {
  const { activateLightningSale, isLoadingLightningSale } =
    useLightningSaleStore();

  const handleActivateLightningSale = async (id: string) => {
    try {
      await activateLightningSale(id);

      toast.success("Lightning sale activated", {
        description: "Lightning sale has been activated successfully.",
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Activation failed", {
        description: err.message ?? "Failed to activate lightning sale.",
      });
    }
  };

  return {
    handleActivateLightningSale,
    isLoading: isLoadingLightningSale,
  };
}
