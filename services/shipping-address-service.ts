import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import CreateAddressRequest from "@/lib/schemas/shipping-address/create-address-request";
import UpdateAddressRequest from "@/lib/schemas/shipping-address/update-address-request";

const SHIPPING_ADDRESSES_URL = "/api/shipping-addresses";

const getShippingAddressesByUserId = async (
  userId: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(
      `${SHIPPING_ADDRESSES_URL}/${userId}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const addShippingAddressesApi = async (
  userId: string,
  request: CreateAddressRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(
      `${SHIPPING_ADDRESSES_URL}/${userId}`,
      request,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updateShippingAddressesApi = async (
  shippingAddressId: string,
  request: UpdateAddressRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.put(
      `${SHIPPING_ADDRESSES_URL}/${shippingAddressId}`,
      request,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deleteShippingAddressesApi = async (
  shippingAddressId: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(
      `${SHIPPING_ADDRESSES_URL}/${shippingAddressId}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  getShippingAddressesByUserId,
  addShippingAddressesApi,
  updateShippingAddressesApi,
  deleteShippingAddressesApi,
};
