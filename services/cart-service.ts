import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import AddToCartRequest from "@/lib/schemas/cart/add-to-cart-request";

const CART_URL = "/api/cart";

const getCart = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(CART_URL);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const syncPrices = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(`${CART_URL}/sync-prices`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const addToCartAPI = async (
  request: AddToCartRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(`${CART_URL}/items`, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export { getCart, syncPrices, addToCartAPI };
