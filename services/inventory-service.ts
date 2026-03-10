import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import { CreateInventoryRequest } from "@/lib/schemas/inventory/create-inventory-request";
import { UpdateInventoryRequest } from "@/lib/schemas/inventory/update-inventory-request";
import { AdjustInventoryRequest } from "@/lib/schemas/inventory/adjust-inventory-request";

const INVENTORY_URL = "/api/inventory";

const getInventories = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(INVENTORY_URL);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getInventoryOfVariant = async (plantVariantId: string) => {
  try {
    const response = await axiosInstance.get(
      `${INVENTORY_URL}/by-variant/${plantVariantId}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getLowStockItems = async (
  threshold: number = 10,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(
      `${INVENTORY_URL}/low-stock?threshold=${threshold}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getOutOfStockItems = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${INVENTORY_URL}/out-of-stock`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const createInventoryApi = async (
  request: CreateInventoryRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(INVENTORY_URL, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updateInventoryApi = async (
  id: string,
  request: UpdateInventoryRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.put(`${INVENTORY_URL}/${id}`, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const adjustInventoryApi = async (
  id: string,
  request: AdjustInventoryRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${INVENTORY_URL}/${id}/adjust`,
      request,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deleteInventoryApi = async (id: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(`${INVENTORY_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  getInventories,
  getInventoryOfVariant,
  getLowStockItems,
  getOutOfStockItems,
  createInventoryApi,
  updateInventoryApi,
  adjustInventoryApi,
  deleteInventoryApi,
};
