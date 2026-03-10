"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useCategoryStore } from "@/stores/category-store";
import { CreateCategoryRequest } from "@/lib/schemas/category/create-category-request";
import { toast } from "sonner";

export function useCreateCategory() {
  const { createCategory, isLoading } = useCategoryStore();

  const handleCreateCategory = async (request: CreateCategoryRequest) => {
    try {
      await createCategory(request);

      toast.success("Category created", {
        description: "Category has been created successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Create failed", {
        description: err.message ?? "Failed to create category.",
      });

      return false;
    }
  };

  return {
    handleCreateCategory,
    isLoading,
  };
}
