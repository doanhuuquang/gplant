"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useCareInstructionStore } from "@/stores/care-instruction-store";
import { UpdateCareInstructionRequest } from "@/lib/schemas/care-instruction.ts/update-care-instruction-request";
import { toast } from "sonner";

export function useUpdateCareInstruction() {
  const { updateCareInstruction, isLoadingCareInstruction } =
    useCareInstructionStore();

  const handleUpdateCareInstruction = async (
    id: string,
    request: UpdateCareInstructionRequest,
  ) => {
    try {
      await updateCareInstruction(id, request);

      toast.success("Care instruction updated", {
        description: "Care instruction has been updated successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update care instruction.",
      });

      return false;
    }
  };

  return {
    handleUpdateCareInstruction,
    isLoading: isLoadingCareInstruction,
  };
}
