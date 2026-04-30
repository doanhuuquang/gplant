import { apiClient } from "@/lib/api/client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import {
  PlantResponse,
  CreatePlantRequest,
  UpdatePlantRequest,
  PlantResponsePageResult,
  PlantImageResponse,
  CreatePlantImageRequest,
  PlantVariantResponse,
  CreatePlantVariantRequest,
  UpdatePlantVariantRequest,
} from "@/types/plant";

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

export const getPlants = async (params: GetPlantsParams = {}) => {
  const { pageNumber = 1, pageSize = 20, ...rest } = params;
  try {
    const { data } = await apiClient.get<
      SuccessResponse<PlantResponsePageResult>
    >("/plants", {
      params: { pageNumber, pageSize, ...rest },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getPlantById = async (id: string) => {
  try {
    const { data } = await apiClient.get<SuccessResponse<PlantResponse>>(
      `/plants/id/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getPlantBySlug = async (slug: string) => {
  try {
    const { data } = await apiClient.get<SuccessResponse<PlantResponse>>(
      `/plants/slug/${slug}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createPlant = async (request: CreatePlantRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<PlantResponse>>(
      "/plants",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updatePlant = async (id: string, request: UpdatePlantRequest) => {
  try {
    const { data } = await apiClient.put<SuccessResponse<null>>(
      `/plants/${id}`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deletePlant = async (id: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/plants/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const toggleActivePlant = async (id: string) => {
  try {
    const { data } = await apiClient.patch<SuccessResponse<null>>(
      `/plants/${id}/toggle-active`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getPlantImagesByPlantId = async (plantId: string) => {
  try {
    const { data } = await apiClient.get<SuccessResponse<PlantImageResponse[]>>(
      `/plant-images/by-plant/${plantId}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createPlantImage = async (request: CreatePlantImageRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<PlantImageResponse>>(
      "/plant-images",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deletePlantImage = async (id: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/plant-images/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const setPrimaryPlantImage = async (id: string) => {
  try {
    const { data } = await apiClient.patch<SuccessResponse<null>>(
      `/plant-images/${id}/set-primary`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getPlantVariantsByPlantId = async (plantId: string) => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<PlantVariantResponse[]>
    >(`/plant-variants/by-plant/${plantId}`);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createPlantVariant = async (
  request: CreatePlantVariantRequest,
) => {
  try {
    const { data } = await apiClient.post<
      SuccessResponse<PlantVariantResponse>
    >("/plant-variants", request);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updatePlantVariant = async (
  id: string,
  request: UpdatePlantVariantRequest,
) => {
  try {
    const { data } = await apiClient.put<SuccessResponse<null>>(
      `/plant-variants/${id}`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deletePlantVariant = async (id: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/plant-variants/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const toggleActivePlantVariant = async (id: string) => {
  try {
    const { data } = await apiClient.patch<SuccessResponse<null>>(
      `/plant-variants/${id}/toggle-active`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
