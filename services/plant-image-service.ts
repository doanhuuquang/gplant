import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";

const PLANT_IMAGES_URL = "/api/plant-images";

const getPlantImagesByPlantId = async (
  plantId: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(
      `${PLANT_IMAGES_URL}/plant/${plantId}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const createPlantImageApi = async (request: {
  plantId: string;
  mediaId: string;
  isPrimary: boolean;
}): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(PLANT_IMAGES_URL, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deletePlantImageApi = async (id: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(`${PLANT_IMAGES_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const setPrimaryPlantImageApi = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${PLANT_IMAGES_URL}/${id}/set-primary`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  getPlantImagesByPlantId,
  createPlantImageApi,
  deletePlantImageApi,
  setPrimaryPlantImageApi,
};
