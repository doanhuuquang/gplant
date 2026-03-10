"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useCategoryStore } from "@/stores/category-store";
import { UpdateCategoryRequest } from "@/lib/schemas/category/update-category-request";
import { toast } from "sonner";

export function useUpdateCategory() {
  const { updateCategory, isLoading } = useCategoryStore();

  const handleUpdateCategory = async (
    id: string,
    request: UpdateCategoryRequest,
  ) => {
    try {
      await updateCategory(id, request);

      toast.success("Category updated", {
        description: "Category has been updated successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update category.",
      });

      return false;
    }
  };

  return {
    handleUpdateCategory,
    isLoading,
  };
}
