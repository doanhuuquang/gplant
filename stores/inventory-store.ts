"use client";

import InventoryResponse from "@/lib/schemas/inventory/inventory-response";
import { create } from "zustand";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { CreateInventoryRequest } from "@/lib/schemas/inventory/create-inventory-request";
import { UpdateInventoryRequest } from "@/lib/schemas/inventory/update-inventory-request";
import { AdjustInventoryRequest } from "@/lib/schemas/inventory/adjust-inventory-request";
import {
  getInventories,
  createInventoryApi,
  updateInventoryApi,
  adjustInventoryApi,
  deleteInventoryApi,
} from "@/services/inventory-service";

type InventoryState = {
  inventories: InventoryResponse[];
  isLoadingInventory: boolean;
  inventoryError: string | null;
};

type InventoryActions = {
  reset: () => void;
  fetchInventories: () => Promise<void>;
  createInventory: (request: CreateInventoryRequest) => Promise<void>;
  updateInventory: (
    id: string,
    request: UpdateInventoryRequest,
  ) => Promise<void>;
  adjustInventory: (
    id: string,
    request: AdjustInventoryRequest,
  ) => Promise<void>;
  deleteInventory: (id: string) => Promise<void>;
};

export const useInventoryStore = create<InventoryState & InventoryActions>(
  (set, get) => ({
    inventories: [],
    isLoadingInventory: false,
    inventoryError: null,

    reset: () =>
      set({
        inventories: [],
        isLoadingInventory: false,
        inventoryError: null,
      }),

    fetchInventories: async () => {
      try {
        set({ isLoadingInventory: true, inventoryError: null });
        const response = await getInventories();
        set({
          inventories: (response.data as InventoryResponse[]) ?? [],
          inventoryError: null,
        });
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ inventoryError: err.message, inventories: [] });
      } finally {
        set({ isLoadingInventory: false });
      }
    },

    createInventory: async (request: CreateInventoryRequest) => {
      try {
        set({ isLoadingInventory: true, inventoryError: null });
        await createInventoryApi(request);
        await get().fetchInventories();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ inventoryError: err.message });
        throw e;
      } finally {
        set({ isLoadingInventory: false });
      }
    },

    updateInventory: async (id: string, request: UpdateInventoryRequest) => {
      try {
        set({ isLoadingInventory: true, inventoryError: null });
        await updateInventoryApi(id, request);
        await get().fetchInventories();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ inventoryError: err.message });
        throw e;
      } finally {
        set({ isLoadingInventory: false });
      }
    },

    adjustInventory: async (id: string, request: AdjustInventoryRequest) => {
      try {
        set({ isLoadingInventory: true, inventoryError: null });
        await adjustInventoryApi(id, request);
        await get().fetchInventories();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ inventoryError: err.message });
        throw e;
      } finally {
        set({ isLoadingInventory: false });
      }
    },

    deleteInventory: async (id: string) => {
      try {
        set({ isLoadingInventory: true, inventoryError: null });
        await deleteInventoryApi(id);
        await get().fetchInventories();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ inventoryError: err.message });
        throw e;
      } finally {
        set({ isLoadingInventory: false });
      }
    },
  }),
);
