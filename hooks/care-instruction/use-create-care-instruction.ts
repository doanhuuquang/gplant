"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useCareInstructionStore } from "@/stores/care-instruction-store";
import { CreateCareInstructionRequest } from "@/lib/schemas/care-instruction.ts/create-care-instruction-request";
import { toast } from "sonner";

export function useCreateCareInstruction() {
  const { createCareInstruction, isLoadingCareInstruction } =
    useCareInstructionStore();

  const handleCreateCareInstruction = async (
    request: CreateCareInstructionRequest,
  ) => {
    try {
      await createCareInstruction(request);

      toast.success("Care instruction created", {
        description: "Care instruction has been created successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Create failed", {
        description: err.message ?? "Failed to create care instruction.",
      });

      return false;
    }
  };

  return {
    handleCreateCareInstruction,
    isLoading: isLoadingCareInstruction,
  };
}
