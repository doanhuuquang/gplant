"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { usePlantStore } from "@/stores/plant-store";
import { UpdatePlantRequest } from "@/lib/schemas/plant/update-plant-request";
import { toast } from "sonner";

export function useUpdatePlant() {
  const { updatePlant, isLoading } = usePlantStore();

  const handleUpdatePlant = async (id: string, request: UpdatePlantRequest) => {
    try {
      await updatePlant(id, request);

      toast.success("Plant updated", {
        description: "Plant has been updated successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update plant.",
      });

      return false;
    }
  };

  return {
    handleUpdatePlant,
    isLoading,
  };
}
