import { apiClient } from "@/lib/api/client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import {
  CreateLightningSaleItemRequest,
  CreateLightningSaleRequest,
  LightningSaleItemResponse,
  LightningSaleResponse,
  UpdateLightningSaleItemRequest,
} from "@/types/lightning-sale";

export const getLightningSales = async () => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<LightningSaleResponse[]>
    >("/lightning-sales/all");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getActiveLightningSales = async () => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<LightningSaleResponse[]>
    >("/lightning-sales/active");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getUpcomingLightningSales = async () => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<LightningSaleResponse[]>
    >("/lightning-sales/upcoming");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getOngoingLightningSales = async () => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<LightningSaleResponse[]>
    >("/lightning-sales/ongoing");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getCurrentActiveSale = async () => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<LightningSaleResponse>
    >("/lightning-sales/current");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getLightningSaleById = async (id: string) => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<LightningSaleResponse>
    >(`/lightning-sales/${id}`);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createLightningSale = async (
  request: CreateLightningSaleRequest,
) => {
  try {
    const { data } = await apiClient.post<
      SuccessResponse<LightningSaleResponse>
    >("/lightning-sales", request);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateLightningSale = async (
  id: string,
  request: CreateLightningSaleRequest,
) => {
  try {
    const { data } = await apiClient.put<SuccessResponse<null>>(
      `/lightning-sales/${id}`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteLightningSale = async (id: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/lightning-sales/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const activeLightningSale = async (id: string) => {
  try {
    const { data } = await apiClient.patch<SuccessResponse<null>>(
      `/lightning-sales/${id}/activate`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deactiveLightningSale = async (id: string) => {
  try {
    const { data } = await apiClient.patch<SuccessResponse<null>>(
      `/lightning-sales/${id}/deactivate`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createLightningSaleItem = async (
  lightningSaleId: string,
  request: CreateLightningSaleItemRequest,
) => {
  try {
    const { data } = await apiClient.post<
      SuccessResponse<LightningSaleItemResponse>
    >(`/lightning-sales/${lightningSaleId}/items`, request);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateLightningSaleItem = async (
  lightningSaleItemId: string,
  request: UpdateLightningSaleItemRequest,
) => {
  try {
    const { data } = await apiClient.put<SuccessResponse<null>>(
      `/lightning-sales/items/${lightningSaleItemId}`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteLightningSaleItem = async (id: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/lightning-sales/items/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getLightningSaleItemByPlantVariantId = async (
  plantVariantId: string,
) => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<LightningSaleItemResponse>
    >(`/lightning-sales/items/variant/${plantVariantId}`);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
