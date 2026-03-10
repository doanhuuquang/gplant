"use client";

import { create } from "zustand";
import {
  getActiveCategories,
  getCategories,
  toggleActiveCategoryApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "@/services/category-service";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import CategoryResponse from "@/lib/schemas/category/category-response";
import { CreateCategoryRequest } from "@/lib/schemas/category/create-category-request";
import { UpdateCategoryRequest } from "@/lib/schemas/category/update-category-request";

type CategoryState = {
  categories: CategoryResponse[];
  activeCategories: CategoryResponse[];
  isLoading: boolean;
  categoryError: string | null;
};

type CategoryActions = {
  reset: () => void;
  fetchCategories: () => Promise<void>;
  fetchActiveCategories: () => Promise<void>;
  toggleActiveCategory: (id: string) => Promise<void>;
  createCategory: (request: CreateCategoryRequest) => Promise<void>;
  updateCategory: (id: string, request: UpdateCategoryRequest) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryState & CategoryActions>(
  (set, get) => ({
    categories: [],
    activeCategories: [],
    isLoading: false,
    categoryError: null,

    reset: () =>
      set({
        categories: [],
        activeCategories: [],
        isLoading: false,
        categoryError: null,
      }),

    fetchCategories: async () => {
      try {
        set({ isLoading: true, categoryError: null, categories: [] });
        const response = await getCategories();
        set({
          categories: (response.data as CategoryResponse[]) ?? [],
          categoryError: null,
        });
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ categoryError: err.message, categories: [] });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchActiveCategories: async () => {
      try {
        set({ isLoading: true, categoryError: null, activeCategories: [] });
        const response = await getActiveCategories();
        set({
          activeCategories: (response.data as CategoryResponse[]) ?? [],
          categoryError: null,
        });
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ categoryError: err.message, activeCategories: [] });
      } finally {
        set({ isLoading: false });
      }
    },

    toggleActiveCategory: async (id: string) => {
      try {
        set({ isLoading: true, categoryError: null });
        await toggleActiveCategoryApi(id);

        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, isActive: !cat.isActive } : cat,
          ),
        }));

        await get().fetchActiveCategories();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ categoryError: err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    createCategory: async (request: CreateCategoryRequest) => {
      try {
        set({ isLoading: true, categoryError: null });
        await createCategoryApi(request);
        await get().fetchCategories();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ categoryError: err.message });
        throw e;
      } finally {
        set({ isLoading: false });
      }
    },

    updateCategory: async (id: string, request: UpdateCategoryRequest) => {
      try {
        set({ isLoading: true, categoryError: null });
        await updateCategoryApi(id, request);
        await get().fetchCategories();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ categoryError: err.message });
        throw e;
      } finally {
        set({ isLoading: false });
      }
    },

    deleteCategory: async (id: string) => {
      try {
        set({ isLoading: true, categoryError: null });
        await deleteCategoryApi(id);
        await get().fetchCategories();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ categoryError: err.message });
        throw e;
      } finally {
        set({ isLoading: false });
      }
    },
  }),
);
