"use client";

import { create } from "zustand";
import {
  getPlants,
  createPlantApi,
  updatePlantApi,
  deletePlantApi,
  toggleActivePlantApi,
  type GetPlantsParams,
} from "@/services/plant-service";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import PlantResponse from "@/lib/schemas/plant/plant-response";
import PlantResponsePageResult from "@/lib/schemas/plant/plant-response-page-result";
import { CreatePlantRequest } from "@/lib/schemas/plant/create-plant-request";
import { UpdatePlantRequest } from "@/lib/schemas/plant/update-plant-request";

type PlantState = {
  plants: PlantResponse[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isLoading: boolean;
  plantError: string | null;
};

type PlantActions = {
  reset: () => void;
  fetchPlants: (params?: GetPlantsParams) => Promise<void>;
  setPageNumber: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;
  createPlant: (request: CreatePlantRequest) => Promise<PlantResponse>;
  updatePlant: (id: string, request: UpdatePlantRequest) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  toggleActivePlant: (id: string) => Promise<void>;
};

export const usePlantStore = create<PlantState & PlantActions>((set, get) => ({
  plants: [],
  pageNumber: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  isLoading: false,
  plantError: null,

  reset: () =>
    set({
      plants: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
      isLoading: false,
      plantError: null,
    }),

  fetchPlants: async (params?: GetPlantsParams) => {
    const { pageNumber, pageSize } = get();
    try {
      set({ isLoading: true, plantError: null });
      const response = await getPlants({ pageNumber, pageSize, ...params });
      const data = response.data as PlantResponsePageResult;
      set({
        plants: data?.items ?? [],
        totalCount: data?.totalCount ?? 0,
        totalPages: data?.totalPages ?? 0,
        hasPreviousPage: data?.hasPreviousPage ?? false,
        hasNextPage: data?.hasNextPage ?? false,
        plantError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ plantError: err.message, plants: [] });
    } finally {
      set({ isLoading: false });
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

  createPlant: async (request: CreatePlantRequest) => {
    try {
      set({ isLoading: true, plantError: null });
      const response = await createPlantApi(request);
      const createdPlant = response.data as PlantResponse;
      await get().fetchPlants();
      return createdPlant;
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ plantError: err.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlant: async (id: string, request: UpdatePlantRequest) => {
    try {
      set({ isLoading: true, plantError: null });
      await updatePlantApi(id, request);
      await get().fetchPlants();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ plantError: err.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlant: async (id: string) => {
    try {
      set({ isLoading: true, plantError: null });
      await deletePlantApi(id);
      await get().fetchPlants();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ plantError: err.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleActivePlant: async (id: string) => {
    try {
      set({ isLoading: true, plantError: null });
      await toggleActivePlantApi(id);

      set((state) => ({
        plants: state.plants.map((p) =>
          p.id === id ? { ...p, isActive: !p.isActive } : p,
        ),
      }));
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ plantError: err.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
