"use client";

import { create } from "zustand";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import CareInstructionResponse from "@/lib/schemas/care-instruction.ts/care-instruction-response";
import { CreateCareInstructionRequest } from "@/lib/schemas/care-instruction.ts/create-care-instruction-request";
import { UpdateCareInstructionRequest } from "@/lib/schemas/care-instruction.ts/update-care-instruction-request";
import {
  getCareInstructions,
  createCareInstructionApi,
  updateCareInstructionApi,
  deleteCareInstructionApi,
} from "@/services/care-instruction-service";

type CareInstructionState = {
  careInstructions: CareInstructionResponse[];
  isLoadingCareInstruction: boolean;
  careInstructionError: string | null;
};

type CareInstructionActions = {
  reset: () => void;
  fetchCareInstructions: () => Promise<void>;
  createCareInstruction: (
    request: CreateCareInstructionRequest,
  ) => Promise<void>;
  updateCareInstruction: (
    id: string,
    request: UpdateCareInstructionRequest,
  ) => Promise<void>;
  deleteCareInstruction: (id: string) => Promise<void>;
};

export const useCareInstructionStore = create<
  CareInstructionState & CareInstructionActions
>((set, get) => ({
  careInstructions: [],
  isLoadingCareInstruction: false,
  careInstructionError: null,

  reset: () =>
    set({
      careInstructions: [],
      isLoadingCareInstruction: false,
      careInstructionError: null,
    }),

  fetchCareInstructions: async () => {
    try {
      set({
        isLoadingCareInstruction: true,
        careInstructionError: null,
        careInstructions: [],
      });
      const response = await getCareInstructions();
      set({
        careInstructions: (response.data as CareInstructionResponse[]) ?? [],
        careInstructionError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ careInstructionError: err.message, careInstructions: [] });
    } finally {
      set({ isLoadingCareInstruction: false });
    }
  },

  createCareInstruction: async (request: CreateCareInstructionRequest) => {
    try {
      set({ isLoadingCareInstruction: true, careInstructionError: null });
      await createCareInstructionApi(request);
      await get().fetchCareInstructions();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ careInstructionError: err.message });
      throw e;
    } finally {
      set({ isLoadingCareInstruction: false });
    }
  },

  updateCareInstruction: async (
    id: string,
    request: UpdateCareInstructionRequest,
  ) => {
    try {
      set({ isLoadingCareInstruction: true, careInstructionError: null });
      await updateCareInstructionApi(id, request);
      await get().fetchCareInstructions();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ careInstructionError: err.message });
      throw e;
    } finally {
      set({ isLoadingCareInstruction: false });
    }
  },

  deleteCareInstruction: async (id: string) => {
    try {
      set({ isLoadingCareInstruction: true, careInstructionError: null });
      await deleteCareInstructionApi(id);
      await get().fetchCareInstructions();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ careInstructionError: err.message });
      throw e;
    } finally {
      set({ isLoadingCareInstruction: false });
    }
  },
}));
