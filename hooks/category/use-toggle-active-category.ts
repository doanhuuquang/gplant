"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useCategoryStore } from "@/stores/category-store";
import { toast } from "sonner";

export function useToggleActiveCategory() {
  const { toggleActiveCategory, isLoading } = useCategoryStore();

  const handleToggleActiveCategory = async (id: string) => {
    try {
      await toggleActiveCategory(id);

      toast.success("Category updated", {
        description: "Category status has been updated successfully.",
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update category status.",
      });
    }
  };

  return {
    handleToggleActiveCategory,
    isLoading,
  };
}
