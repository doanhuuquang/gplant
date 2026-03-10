import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import { CreatePlantVariantRequest } from "@/lib/schemas/plant/create-plant-variant-request";
import { UpdatePlantVariantRequest } from "@/lib/schemas/plant/update-plant-variant-request";

const PLANT_VARIANTS_URL = "/api/plant-variants";

const getPlantVariantsByPlantId = async (
  plantId: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(
      `${PLANT_VARIANTS_URL}/plant/${plantId}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const createPlantVariantApi = async (
  request: CreatePlantVariantRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(PLANT_VARIANTS_URL, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updatePlantVariantApi = async (
  id: string,
  request: UpdatePlantVariantRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.put(
      `${PLANT_VARIANTS_URL}/${id}`,
      request,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deletePlantVariantApi = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(`${PLANT_VARIANTS_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const toggleActivePlantVariantApi = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${PLANT_VARIANTS_URL}/${id}/toggle-active`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  getPlantVariantsByPlantId,
  createPlantVariantApi,
  updatePlantVariantApi,
  deletePlantVariantApi,
  toggleActivePlantVariantApi,
};
