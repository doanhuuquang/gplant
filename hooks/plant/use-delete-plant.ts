"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { usePlantStore } from "@/stores/plant-store";
import { toast } from "sonner";

export function useDeletePlant() {
  const { deletePlant, isLoading } = usePlantStore();

  const handleDeletePlant = async (id: string) => {
    try {
      await deletePlant(id);

      toast.success("Plant deleted", {
        description: "Plant has been deleted successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Delete failed", {
        description: err.message ?? "Failed to delete plant.",
      });

      return false;
    }
  };

  return {
    handleDeletePlant,
    isLoading,
  };
}
