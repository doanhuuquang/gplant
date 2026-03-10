"use client";

import { useState } from "react";
import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { UpdatePlantVariantRequest } from "@/lib/schemas/plant/update-plant-variant-request";
import { updatePlantVariantApi } from "@/services/plant-variant-service";
import { toast } from "sonner";

export function useUpdatePlantVariant() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateVariant = async (
    id: string,
    request: UpdatePlantVariantRequest,
  ) => {
    try {
      setIsLoading(true);
      await updatePlantVariantApi(id, request);

      toast.success("Variant updated", {
        description: "Plant variant has been updated successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update plant variant.",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUpdateVariant,
    isLoading,
  };
}
