import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import { CreateLightningSaleRequest } from "@/lib/schemas/lightning-sale/create-lightning-sale-request";
import { UpdateLightningSaleRequest } from "@/lib/schemas/lightning-sale/update-lightning-sale-request";
import { AddSaleItemRequest } from "@/lib/schemas/lightning-sale/add-sale-item-request";
import { UpdateSaleItemRequest } from "@/lib/schemas/lightning-sale/update-sale-item-request";

const LIGHTNING_SALE_URL = "/api/lightning-sales";

const getAllLightningSales = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${LIGHTNING_SALE_URL}/all`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getActiveLightningSales = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${LIGHTNING_SALE_URL}/active`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getUpcomingLightningSales = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${LIGHTNING_SALE_URL}/upcoming`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getOngoingLightningSales = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${LIGHTNING_SALE_URL}/ongoing`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getCurrentActiveSale = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${LIGHTNING_SALE_URL}/current`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getLightningSaleById = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${LIGHTNING_SALE_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const createLightningSaleApi = async (
  request: CreateLightningSaleRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(LIGHTNING_SALE_URL, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updateLightningSaleApi = async (
  id: string,
  request: UpdateLightningSaleRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.put(
      `${LIGHTNING_SALE_URL}/${id}`,
      request,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deleteLightningSaleApi = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(`${LIGHTNING_SALE_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const activateLightningSaleApi = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${LIGHTNING_SALE_URL}/${id}/activate`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deactivateLightningSaleApi = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${LIGHTNING_SALE_URL}/${id}/deactivate`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const addSaleItemApi = async (
  saleId: string,
  request: AddSaleItemRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(
      `${LIGHTNING_SALE_URL}/${saleId}/items`,
      request,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updateSaleItemApi = async (
  itemId: string,
  request: UpdateSaleItemRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.put(
      `${LIGHTNING_SALE_URL}/items/${itemId}`,
      request,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const removeSaleItemApi = async (
  itemId: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(
      `${LIGHTNING_SALE_URL}/items/${itemId}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getLightningSaleItemByVariantId = async (
  plantVariantId: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(
      `${LIGHTNING_SALE_URL}/items/variant/${plantVariantId}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  getAllLightningSales,
  getActiveLightningSales,
  getUpcomingLightningSales,
  getOngoingLightningSales,
  getCurrentActiveSale,
  getLightningSaleById,
  createLightningSaleApi,
  updateLightningSaleApi,
  deleteLightningSaleApi,
  activateLightningSaleApi,
  deactivateLightningSaleApi,
  addSaleItemApi,
  updateSaleItemApi,
  removeSaleItemApi,
  getLightningSaleItemByVariantId,
};
