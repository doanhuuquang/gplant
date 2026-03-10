"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useLightningSaleStore } from "@/stores/lightning-sale-store";
import { CreateLightningSaleRequest } from "@/lib/schemas/lightning-sale/create-lightning-sale-request";
import { toast } from "sonner";

export function useCreateLightningSale() {
  const { createLightningSale, isLoadingLightningSale } =
    useLightningSaleStore();

  const handleCreateLightningSale = async (
    request: CreateLightningSaleRequest,
  ) => {
    try {
      await createLightningSale(request);

      toast.success("Lightning sale created", {
        description: "Lightning sale has been created successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Create failed", {
        description: err.message ?? "Failed to create lightning sale.",
      });

      return false;
    }
  };

  return {
    handleCreateLightningSale,
    isLoading: isLoadingLightningSale,
  };
}
