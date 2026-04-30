import { apiClient } from "@/lib/api/client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import {
  AddItemToCartRequest,
  CartResponse,
  UpdateCartItemRequest,
} from "@/types/cart";

export const getCart = async () => {
  try {
    const { data } =
      await apiClient.get<SuccessResponse<CartResponse>>("/cart");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const syncPrices = async () => {
  try {
    const { data } =
      await apiClient.get<SuccessResponse<null>>("/cart/sync-prices");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const addItemToCart = async (request: AddItemToCartRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<CartResponse>>(
      "/cart/items",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateCartItem = async (
  cartItemId: string,
  request: UpdateCartItemRequest,
) => {
  try {
    const { data } = await apiClient.put<SuccessResponse<CartResponse>>(
      `/cart/items/${cartItemId}`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const removeCartItem = async (cartItemId: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/cart/items/${cartItemId}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
