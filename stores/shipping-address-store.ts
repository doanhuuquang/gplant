"use client";

import { create } from "zustand";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import ShippingAddressResponse from "@/lib/schemas/shipping-address/shipping-address-response";
import {
  addShippingAddressesApi,
  deleteShippingAddressesApi,
  getShippingAddressesByUserId,
  updateShippingAddressesApi,
} from "@/services/shipping-address-service";
import CreateAddressRequest from "@/lib/schemas/shipping-address/create-address-request";
import UpdateAddressRequest from "@/lib/schemas/shipping-address/update-address-request";

type ShippingAddressState = {
  shippingAddresses: ShippingAddressResponse[];
  isLoadingShippingAddress: boolean;
  isAddingShippingAddress: boolean;
  isUpdatingShippingAddress: boolean;
  isDeletingShippingAddress: boolean;
  shippingAddressError: string | null;
};

type ShippingAddressActions = {
  reset: () => void;
  fetchShippingAddresses: (userId: string) => Promise<void>;
  createShippingAddress: (
    userId: string,
    request: CreateAddressRequest,
  ) => Promise<void>;
  updateShippingAddress: (
    userId: string,
    request: UpdateAddressRequest,
  ) => Promise<void>;
  deleteShippingAddress: (shippingAddressId: string) => Promise<void>;
};

export const useShippingAddressStore = create<
  ShippingAddressState & ShippingAddressActions
>((set, get) => ({
  shippingAddresses: [],
  isLoadingShippingAddress: false,
  isAddingShippingAddress: false,
  isUpdatingShippingAddress: false,
  isDeletingShippingAddress: false,
  shippingAddressError: null,

  reset: () =>
    set({
      shippingAddresses: [],
      isLoadingShippingAddress: false,
      shippingAddressError: null,
    }),

  fetchShippingAddresses: async (userId: string) => {
    try {
      set({ isLoadingShippingAddress: true, shippingAddressError: null });
      const response = await getShippingAddressesByUserId(userId);
      const data = response.data as ShippingAddressResponse[];
      set({
        shippingAddresses: data ?? [],
        shippingAddressError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ shippingAddressError: err.message, shippingAddresses: [] });
    } finally {
      set({ isLoadingShippingAddress: false });
    }
  },

  createShippingAddress: async (
    userId: string,
    request: CreateAddressRequest,
  ) => {
    try {
      set({ isAddingShippingAddress: true, shippingAddressError: null });
      await addShippingAddressesApi(userId, request);
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ shippingAddressError: err.message });
      throw e;
    } finally {
      set({ isAddingShippingAddress: false });
    }
  },

  updateShippingAddress: async (
    shippingAddressId: string,
    request: UpdateAddressRequest,
  ) => {
    try {
      set({ isUpdatingShippingAddress: true, shippingAddressError: null });
      await updateShippingAddressesApi(shippingAddressId, request);
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ shippingAddressError: err.message });
      throw e;
    } finally {
      set({ isUpdatingShippingAddress: false });
    }
  },

  deleteShippingAddress: async (shippingAddressId: string) => {
    try {
      set({ isDeletingShippingAddress: true, shippingAddressError: null });
      await deleteShippingAddressesApi(shippingAddressId);

      set((state) => ({
        shippingAddresses: state.shippingAddresses.filter(
          (addr) => addr.id !== shippingAddressId,
        ),
      }));
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ shippingAddressError: err.message });
      throw e;
    } finally {
      set({ isDeletingShippingAddress: false });
    }
  },
}));
