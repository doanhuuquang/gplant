"use client";

import { LightningSaleResponse } from "@/lib/schemas/lightning-sale/lightning-sale-response";
import { create } from "zustand";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { CreateLightningSaleRequest } from "@/lib/schemas/lightning-sale/create-lightning-sale-request";
import { UpdateLightningSaleRequest } from "@/lib/schemas/lightning-sale/update-lightning-sale-request";
import { AddSaleItemRequest } from "@/lib/schemas/lightning-sale/add-sale-item-request";
import { UpdateSaleItemRequest } from "@/lib/schemas/lightning-sale/update-sale-item-request";
import {
  getAllLightningSales,
  getLightningSaleById,
  createLightningSaleApi,
  updateLightningSaleApi,
  deleteLightningSaleApi,
  activateLightningSaleApi,
  deactivateLightningSaleApi,
  addSaleItemApi,
  updateSaleItemApi,
  removeSaleItemApi,
  getOngoingLightningSales,
} from "@/services/lightning-sale-service";

type LightningSaleState = {
  lightningSales: LightningSaleResponse[];
  ongoingLightningSales: LightningSaleResponse[];
  currentSale: LightningSaleResponse | null;
  isLoadingLightningSale: boolean;
  lightningSaleError: string | null;
};

type LightningSaleActions = {
  reset: () => void;
  fetchLightningSales: () => Promise<void>;
  fetchOngoingLightningSales: () => Promise<void>;
  fetchLightningSaleById: (id: string) => Promise<void>;
  createLightningSale: (request: CreateLightningSaleRequest) => Promise<void>;
  updateLightningSale: (
    id: string,
    request: UpdateLightningSaleRequest,
  ) => Promise<void>;
  deleteLightningSale: (id: string) => Promise<void>;
  activateLightningSale: (id: string) => Promise<void>;
  deactivateLightningSale: (id: string) => Promise<void>;
  addSaleItem: (saleId: string, request: AddSaleItemRequest) => Promise<void>;
  updateSaleItem: (
    itemId: string,
    request: UpdateSaleItemRequest,
  ) => Promise<void>;
  removeSaleItem: (itemId: string) => Promise<void>;
};

export const useLightningSaleStore = create<
  LightningSaleState & LightningSaleActions
>((set, get) => ({
  lightningSales: [],
  ongoingLightningSales: [],
  currentSale: null,
  isLoadingLightningSale: false,
  lightningSaleError: null,

  reset: () =>
    set({
      lightningSales: [],
      currentSale: null,
      isLoadingLightningSale: false,
      lightningSaleError: null,
    }),

  fetchLightningSales: async () => {
    try {
      set({ isLoadingLightningSale: true, lightningSaleError: null });
      const response = await getAllLightningSales();
      set({
        lightningSales: (response.data as LightningSaleResponse[]) ?? [],
        lightningSaleError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ lightningSaleError: err.message, lightningSales: [] });
    } finally {
      set({ isLoadingLightningSale: false });
    }
  },

  fetchOngoingLightningSales: async () => {
    try {
      set({ isLoadingLightningSale: true, lightningSaleError: null });
      const response = await getOngoingLightningSales();
      set({
        ongoingLightningSales: (response.data as LightningSaleResponse[]) ?? [],
        lightningSaleError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ lightningSaleError: err.message, ongoingLightningSales: [] });
    } finally {
      set({ isLoadingLightningSale: false });
    }
  },

  fetchLightningSaleById: async (id: string) => {
    try {
      set({ isLoadingLightningSale: true, lightningSaleError: null });
      const response = await getLightningSaleById(id);
      set({
        currentSale: (response.data as LightningSaleResponse) ?? null,
        lightningSaleError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ lightningSaleError: err.message, currentSale: null });
    } finally {
      set({ isLoadingLightningSale: false });
    }
  },

  createLightningSale: async (request: CreateLightningSaleRequest) => {
    try {
      set({ isLoadingLightningSale: true, lightningSaleError: null });
      await createLightningSaleApi(request);
      await get().fetchLightningSales();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ lightningSaleError: err.message });
      throw e;
    } finally {
      set({ isLoadingLightningSale: false });
    }
  },

  updateLightningSale: async (
    id: string,
    request: UpdateLightningSaleRequest,
  ) => {
    try {
      set({ isLoadingLightningSale: true, lightningSaleError: null });
      await updateLightningSaleApi(id, request);
      await get().fetchLightningSales();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ lightningSaleError: err.message });
      throw e;
    } finally {
      set({ isLoadingLightningSale: false });
    }
  },

  deleteLightningSale: async (id: string) => {
    try {
      set({ isLoadingLightningSale: true, lightningSaleError: null });
      await deleteLightningSaleApi(id);
      await get().fetchLightningSales();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ lightningSaleError: err.message });
      throw e;
    } finally {
      set({ isLoadingLightningSale: false });
    }
  },

  activateLightningSale: async (id: string) => {
    try {
      set({ isLoadingLightningSale: true, lightningSaleError: null });
      await activateLightningSaleApi(id);
      await get().fetchLightningSales();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ lightningSaleError: err.message });
      throw e;
    } finally {
      set({ isLoadingLightningSale: false });
    }
  },

  deactivateLightningSale: async (id: string) => {
    try {
      set({ isLoadingLightningSale: true, lightningSaleError: null });
      await deactivateLightningSaleApi(id);
      await get().fetchLightningSales();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ lightningSaleError: err.message });
      throw e;
    } finally {
      set({ isLoadingLightningSale: false });
    }
  },

  addSaleItem: async (saleId: string, request: AddSaleItemRequest) => {
    try {
      set({ isLoadingLightningSale: true, lightningSaleError: null });
      await addSaleItemApi(saleId, request);
      await get().fetchLightningSaleById(saleId);
      await get().fetchLightningSales();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ lightningSaleError: err.message });
      throw e;
    } finally {
      set({ isLoadingLightningSale: false });
    }
  },

  updateSaleItem: async (itemId: string, request: UpdateSaleItemRequest) => {
    try {
      set({ isLoadingLightningSale: true, lightningSaleError: null });
      await updateSaleItemApi(itemId, request);
      const currentSale = get().currentSale;
      if (currentSale) await get().fetchLightningSaleById(currentSale.id);
      await get().fetchLightningSales();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ lightningSaleError: err.message });
      throw e;
    } finally {
      set({ isLoadingLightningSale: false });
    }
  },

  removeSaleItem: async (itemId: string) => {
    try {
      set({ isLoadingLightningSale: true, lightningSaleError: null });
      await removeSaleItemApi(itemId);
      const currentSale = get().currentSale;
      if (currentSale) await get().fetchLightningSaleById(currentSale.id);
      await get().fetchLightningSales();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ lightningSaleError: err.message });
      throw e;
    } finally {
      set({ isLoadingLightningSale: false });
    }
  },
}));
