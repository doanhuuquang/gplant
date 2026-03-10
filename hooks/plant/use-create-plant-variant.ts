"use client";

import { useState } from "react";
import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { CreatePlantVariantRequest } from "@/lib/schemas/plant/create-plant-variant-request";
import { createPlantVariantApi } from "@/services/plant-variant-service";
import { toast } from "sonner";

export function useCreatePlantVariant() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateVariant = async (request: CreatePlantVariantRequest) => {
    try {
      setIsLoading(true);
      await createPlantVariantApi(request);

      toast.success("Variant created", {
        description: "Plant variant has been created successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Create failed", {
        description: err.message ?? "Failed to create plant variant.",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleCreateVariant,
    isLoading,
  };
}
