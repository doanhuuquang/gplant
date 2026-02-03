"use client";

import Category from "@/lib/models/category";
import { create } from "zustand";
import { getActiveCategories } from "@/services/category-service";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";

type CategoryState = {
  categories: Category[];
  activeCategories: Category[];
  isLoading: boolean;
  categoryError: string | null;
};

type CategoryActions = {
  reset: () => void;
  fetchCategories: () => Promise<void>;
  fetchActiveCategories: () => Promise<void>;
};

export const useCategoryStore = create<CategoryState & CategoryActions>(
  (set) => ({
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
        const response = await getActiveCategories();
        set({
          activeCategories: (response.data as Category[]) ?? [],
          categoryError: null,
        });
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ categoryError: err.message, activeCategories: [] });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchActiveCategories: async () => {
      try {
        set({ isLoading: true, categoryError: null, activeCategories: [] });
        const response = await getActiveCategories();
        set({
          activeCategories: (response.data as Category[]) ?? [],
          categoryError: null,
        });
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ categoryError: err.message, activeCategories: [] });
      } finally {
        set({ isLoading: false });
      }
    },
  }),
);
