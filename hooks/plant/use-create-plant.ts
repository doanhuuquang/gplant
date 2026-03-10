"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { usePlantStore } from "@/stores/plant-store";
import { CreatePlantRequest } from "@/lib/schemas/plant/create-plant-request";
import { toast } from "sonner";
import PlantResponse from "@/lib/schemas/plant/plant-response";

export function useCreatePlant() {
  const { createPlant, isLoading } = usePlantStore();

  const handleCreatePlant = async (
    request: CreatePlantRequest,
  ): Promise<PlantResponse | null> => {
    try {
      const createdPlant = await createPlant(request);

      toast.success("Plant created", {
        description: "Plant has been created successfully.",
      });

      return createdPlant;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Create failed", {
        description: err.message ?? "Failed to create plant.",
      });

      return null;
    }
  };

  return {
    handleCreatePlant,
    isLoading,
  };
}
