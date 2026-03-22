import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import { CreateOrderRequest } from "@/lib/schemas/order/create-order-rquest";
import { OrderFilterRequest } from "@/lib/schemas/order/order-filter-request";

const ORDER_URL = "/api/orders";

const myOrdersApi = async (
  params: OrderFilterRequest = {},
): Promise<ApiSuccessResponse> => {
  const { pageNumber = 1, pageSize = 20, ...rest } = params;

  try {
    const response = await axiosInstance.get(`${ORDER_URL}/my-orders`, {
      params: { pageNumber, pageSize, ...rest },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const placeOrderApi = async (
  request: CreateOrderRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(ORDER_URL, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const GetQRPaymentByOrderId = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(
      `${ORDER_URL}/${orderId}/qr-payment`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const GetVNPayUrlByOrderId = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(
      `${ORDER_URL}/${orderId}/vnpay-url`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getOrderByOrderNumberApi = async (
  orderNumber: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(
      `${ORDER_URL}/number/${orderNumber}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  myOrdersApi,
  placeOrderApi,
  GetQRPaymentByOrderId,
  GetVNPayUrlByOrderId,
  getOrderByOrderNumberApi,
};
