"use client";

import { useEffect } from "react";
import { useCategoryStore } from "@/stores/category-store";

export function useGetCategories() {
  const { categories, isLoading, categoryError, fetchCategories } =
    useCategoryStore();

  useEffect(() => {
    if (!categories?.length) {
      fetchCategories();
    }
  }, [categories?.length, fetchCategories]);

  return {
    categories,
    isLoading,
    categoryError,
  };
}
