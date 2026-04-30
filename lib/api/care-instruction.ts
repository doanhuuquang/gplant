import { apiClient } from "@/lib/api/client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import {
  CareInstructionResponse,
  CreateCareInstructionRequest,
  UpdateCareInstructionRequest,
} from "@/types/care-instruction";

export const getCareInstructions = async () => {
  try {
    const { data } =
      await apiClient.get<SuccessResponse<CareInstructionResponse[]>>(
        "/care-instructions",
      );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getCareInstructionById = async (id: string) => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<CareInstructionResponse>
    >(`/care-instructions/${id}`);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createCareInstruction = async (
  request: CreateCareInstructionRequest,
) => {
  try {
    const { data } = await apiClient.post<
      SuccessResponse<CareInstructionResponse>
    >(`/care-instructions/`, request);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateCareInstruction = async (
  id: string,
  request: UpdateCareInstructionRequest,
) => {
  try {
    const { data } = await apiClient.put<
      SuccessResponse<CareInstructionResponse>
    >(`/care-instructions/${id}`, request);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteCareInstruction = async (id: string) => {
  try {
    const { data } = await apiClient.delete<
      SuccessResponse<CareInstructionResponse>
    >(`/care-instructions/${id}`);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
