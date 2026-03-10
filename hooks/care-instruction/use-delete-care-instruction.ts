"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useCareInstructionStore } from "@/stores/care-instruction-store";
import { toast } from "sonner";

export function useDeleteCareInstruction() {
  const { deleteCareInstruction, isLoadingCareInstruction } =
    useCareInstructionStore();

  const handleDeleteCareInstruction = async (id: string) => {
    try {
      await deleteCareInstruction(id);

      toast.success("Care instruction deleted", {
        description: "Care instruction has been deleted successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Delete failed", {
        description: err.message ?? "Failed to delete care instruction.",
      });

      return false;
    }
  };

  return {
    handleDeleteCareInstruction,
    isLoading: isLoadingCareInstruction,
  };
}
