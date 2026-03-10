"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { usePlantStore } from "@/stores/plant-store";
import { toast } from "sonner";

export function useToggleActivePlant() {
  const { toggleActivePlant, isLoading } = usePlantStore();

  const handleToggleActivePlant = async (id: string) => {
    try {
      await toggleActivePlant(id);

      toast.success("Plant updated", {
        description: "Plant status has been updated successfully.",
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update plant status.",
      });
    }
  };

  return {
    handleToggleActivePlant,
    isLoading,
  };
}
