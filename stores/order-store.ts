"use client";

import { create } from "zustand";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { CreateOrderRequest } from "@/lib/schemas/order/create-order-rquest";
import { myOrdersApi, placeOrderApi } from "@/services/order-service";
import { OrderResponse } from "@/lib/schemas/order/order-response";
import { OrderFilterRequest } from "@/lib/schemas/order/order-filter-request";
import { OrderResponsePageResult } from "@/lib/schemas/order/order-response-page-result";
import { CreateOrderResponse } from "@/lib/schemas/order/create-order-response";

type OrderState = {
  myOrders: OrderResponse[];
  isPlacingOrder: boolean;
  isLoadingMyOrders: boolean;
  orderError: string | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

type OrderActions = {
  reset: () => void;
  fetchMyOrders: () => Promise<void>;
  placeOrder: (
    request: CreateOrderRequest,
  ) => Promise<CreateOrderResponse | null>;
  setPageNumber: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;
};

export const useOrderStore = create<OrderState & OrderActions>((set, get) => ({
  myOrders: [],
  isPlacingOrder: false,
  isLoadingMyOrders: true,
  orderError: null,
  pageNumber: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,

  reset: () =>
    set({
      myOrders: [],
      isPlacingOrder: false,
      isLoadingMyOrders: true,
      orderError: null,
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    }),

  fetchMyOrders: async (params?: OrderFilterRequest) => {
    const { pageNumber, pageSize } = get();

    try {
      set({ isLoadingMyOrders: true, orderError: null });
      const response = await myOrdersApi({ pageNumber, pageSize, ...params });
      const data = response.data as OrderResponsePageResult;
      set({
        myOrders: data?.items ?? [],
        totalCount: data?.totalCount ?? 0,
        totalPages: data?.totalPages ?? 0,
        hasPreviousPage: data?.hasPreviousPage ?? false,
        hasNextPage: data?.hasNextPage ?? false,
        orderError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ orderError: err.message });
      throw e;
    } finally {
      set({ isLoadingMyOrders: false });
    }
  },

  placeOrder: async (request: CreateOrderRequest) => {
    try {
      set({ isPlacingOrder: true, orderError: null });
      const response = await placeOrderApi(request);
      return response.data as CreateOrderResponse;
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ orderError: err.message });
      throw e;
    } finally {
      set({ isPlacingOrder: false });
    }
  },

  setPageNumber: (pageNumber: number) => {
    const { totalPages } = get();
    if (pageNumber < 1 || pageNumber > totalPages) return;
    set({ pageNumber });
  },

  setPageSize: (pageSize: number) => {
    set({ pageSize, pageNumber: 1 });
  },
}));
