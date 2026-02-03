"use client";

import { useEffect } from "react";
import { useCategoryStore } from "@/stores/category-store";

export function useGetActiveCategories() {
  const { activeCategories, isLoading, categoryError, fetchActiveCategories } =
    useCategoryStore();

  useEffect(() => {
    if (!activeCategories?.length) {
      fetchActiveCategories();
    }
  }, [activeCategories?.length, fetchActiveCategories]);

  return {
    activeCategories,
    isLoading,
    categoryError,
  };
}
