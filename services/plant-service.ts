import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import { CreatePlantRequest } from "@/lib/schemas/plant/create-plant-request";
import { UpdatePlantRequest } from "@/lib/schemas/plant/update-plant-request";

const PLANTS_URL = "/api/plants";

export interface GetPlantsParams {
  searchTerm?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

const getPlants = async (
  params: GetPlantsParams = {},
): Promise<ApiSuccessResponse> => {
  const { pageNumber = 1, pageSize = 20, ...rest } = params;

  try {
    const response = await axiosInstance.get(PLANTS_URL, {
      params: { pageNumber, pageSize, ...rest },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getPlantById = async (id: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${PLANTS_URL}/id/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getPlantBySlug = async (slug: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${PLANTS_URL}/slug/${slug}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const createPlantApi = async (
  request: CreatePlantRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(PLANTS_URL, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updatePlantApi = async (
  id: string,
  request: UpdatePlantRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.put(`${PLANTS_URL}/${id}`, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deletePlantApi = async (id: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(`${PLANTS_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const toggleActivePlantApi = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${PLANTS_URL}/${id}/toggle-active`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  getPlants,
  getPlantById,
  getPlantBySlug,
  createPlantApi,
  updatePlantApi,
  deletePlantApi,
  toggleActivePlantApi,
};
