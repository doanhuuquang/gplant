"use client";

import { useState } from "react";
import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { deletePlantVariantApi } from "@/services/plant-variant-service";
import { toast } from "sonner";

export function useDeletePlantVariant() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteVariant = async (id: string, sku?: string) => {
    try {
      setIsLoading(true);
      await deletePlantVariantApi(id);

      toast.success("Variant deleted", {
        description: sku
          ? `Variant ${sku} has been deleted.`
          : "Plant variant has been deleted.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Delete failed", {
        description: err.message ?? "Failed to delete plant variant.",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleDeleteVariant,
    isLoading,
  };
}
