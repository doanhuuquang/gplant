"use client";

import { useEffect } from "react";
import { useCareInstructionStore } from "@/stores/care-instruction-store";

export function useGetCareInstructions() {
  const {
    careInstructions,
    isLoadingCareInstruction,
    careInstructionError,
    fetchCareInstructions,
  } = useCareInstructionStore();

  useEffect(() => {
    if (!careInstructions?.length) {
      fetchCareInstructions();
    }
  }, [careInstructions?.length, fetchCareInstructions]);

  return {
    careInstructions,
    isLoading: isLoadingCareInstruction,
    careInstructionError,
  };
}
