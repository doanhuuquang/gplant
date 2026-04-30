import { apiClient } from "@/lib/api/client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import {
  AdjustInventoryRequest,
  CreateInventoryRequest,
  InventoryResponse,
  UpdateInventoryRequest,
} from "@/types/inventory";

export const getInventories = async () => {
  try {
    const { data } =
      await apiClient.get<SuccessResponse<InventoryResponse[]>>("/inventory");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getInventoryOfVariant = async (plantVariantId: string) => {
  try {
    const { data } = await apiClient.get<SuccessResponse<InventoryResponse>>(
      `/inventory/by-variant/${plantVariantId}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getLowStockItems = async (threshold: number = 10) => {
  try {
    const { data } = await apiClient.get<SuccessResponse<InventoryResponse[]>>(
      `/inventory/low-stock?threshold=${threshold}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getOutOfStockItems = async () => {
  try {
    const { data } = await apiClient.get<SuccessResponse<InventoryResponse[]>>(
      "/inventory/out-of-stock",
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createInventory = async (request: CreateInventoryRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<InventoryResponse>>(
      "/inventory",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateInventory = async (
  id: string,
  request: UpdateInventoryRequest,
) => {
  try {
    const { data } = await apiClient.put<SuccessResponse<null>>(
      `/inventory/${id}`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const adjustInventoryApi = async (
  id: string,
  request: AdjustInventoryRequest,
) => {
  try {
    const { data } = await apiClient.patch<SuccessResponse<null>>(
      `/inventory/${id}/adjust`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteInventory = async (id: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/inventory/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
