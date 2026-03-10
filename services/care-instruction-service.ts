import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import { CreateCareInstructionRequest } from "@/lib/schemas/care-instruction.ts/create-care-instruction-request";
import { UpdateCareInstructionRequest } from "@/lib/schemas/care-instruction.ts/update-care-instruction-request";

const CARE_INSTRUCTION_URL = "/api/care-instructions";

const getCareInstructions = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(CARE_INSTRUCTION_URL);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getCareInstructionById = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${CARE_INSTRUCTION_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const createCareInstructionApi = async (
  request: CreateCareInstructionRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(CARE_INSTRUCTION_URL, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updateCareInstructionApi = async (
  id: string,
  request: UpdateCareInstructionRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.put(
      `${CARE_INSTRUCTION_URL}/${id}`,
      request,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deleteCareInstructionApi = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(
      `${CARE_INSTRUCTION_URL}/${id}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  getCareInstructions,
  getCareInstructionById,
  createCareInstructionApi,
  updateCareInstructionApi,
  deleteCareInstructionApi,
};
