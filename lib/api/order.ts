import { apiClient } from "./client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import {
  CancelOrderRequest,
  CreateOrderRequest,
  CreateOrderResponse,
  OrderFilterRequest,
  OrderResponse,
  OrderResponsePageResult,
  UpdateOrderStatusRequest,
} from "@/types/order";

export const getOrders = async (params: OrderFilterRequest) => {
  const { pageNumber = 1, pageSize = 20, ...rest } = params;
  try {
    const { data } = await apiClient.get<
      SuccessResponse<OrderResponsePageResult>
    >("/orders", {
      params: { pageNumber, pageSize, ...rest },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMyOrders = async (params: OrderFilterRequest) => {
  const { pageNumber = 1, pageSize = 20, ...rest } = params;
  try {
    const { data } = await apiClient.get<
      SuccessResponse<OrderResponsePageResult>
    >("/orders/my-orders", {
      params: { pageNumber, pageSize, ...rest },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const placeOrder = async (request: CreateOrderRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<CreateOrderResponse>>(
      "/orders",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getQRPaymentByOrderId = async (orderId: string) => {
  try {
    const { data } = await apiClient.get<SuccessResponse<string>>(
      `/orders/${orderId}/qr-payment`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getVNPayUrlByOrderId = async (orderId: string) => {
  try {
    const { data } = await apiClient.get<SuccessResponse<string>>(
      `/orders/${orderId}/vnpay-url`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getOrderByOrderNumber = async (orderNumber: string) => {
  try {
    const { data } = await apiClient.get<SuccessResponse<OrderResponse>>(
      `/orders/number/${orderNumber}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateOrderStatus = async (
  orderId: string,
  request: UpdateOrderStatusRequest,
) => {
  try {
    const { data } = await apiClient.patch<SuccessResponse<string>>(
      `/orders/${orderId}/status`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const cancelOrder = async (
  orderId: string,
  request: CancelOrderRequest,
) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<string>>(
      `/orders/${orderId}/cancel`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
