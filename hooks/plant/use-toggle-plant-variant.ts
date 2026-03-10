"use client";

import { useState } from "react";
import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { toggleActivePlantVariantApi } from "@/services/plant-variant-service";
import { toast } from "sonner";

export function useTogglePlantVariant() {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleVariant = async (id: string, currentlyActive: boolean) => {
    try {
      setIsLoading(true);
      await toggleActivePlantVariantApi(id);

      toast.success(
        currentlyActive ? "Variant deactivated" : "Variant activated",
      );

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Toggle failed", {
        description: err.message ?? "Failed to toggle variant status.",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleToggleVariant,
    isLoading,
  };
}
