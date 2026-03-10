"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useCategoryStore } from "@/stores/category-store";
import { toast } from "sonner";

export function useDeleteCategory() {
  const { deleteCategory, isLoading } = useCategoryStore();

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);

      toast.success("Category deleted", {
        description: "Category has been deleted successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Delete failed", {
        description: err.message ?? "Failed to delete category.",
      });

      return false;
    }
  };

  return {
    handleDeleteCategory,
    isLoading,
  };
}
