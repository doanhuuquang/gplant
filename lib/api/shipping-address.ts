import { apiClient } from "./client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import {
  CreateShippingAddressRequest,
  ShippingAddressResponse,
  UpdateShippingAddressRequest,
} from "@/types/shipping-address";

export const getShippingAddressesByUserId = async (userId: string) => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<ShippingAddressResponse[]>
    >(`/shipping-addresses/${userId}`);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createShippingAddress = async (
  userId: string,
  request: CreateShippingAddressRequest,
) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<null>>(
      `/shipping-addresses/${userId}`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateShippingAddress = async (
  shippingAddressId: string,
  request: UpdateShippingAddressRequest,
) => {
  try {
    const { data } = await apiClient.put<SuccessResponse<null>>(
      `/shipping-addresses/${shippingAddressId}`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteShippingAddress = async (shippingAddressId: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/shipping-addresses/${shippingAddressId}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
