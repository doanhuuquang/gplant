"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useBannerStore } from "@/stores/banner-store";
import { toast } from "sonner";

export function useDeleteBanner() {
  const { deleteBanner, isLoadingBanner } = useBannerStore();

  const handleDeleteBanner = async (id: string) => {
    try {
      await deleteBanner(id);

      toast.success("Banner deleted", {
        description: "Banner has been deleted successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Delete failed", {
        description: err.message ?? "Failed to delete banner.",
      });

      return false;
    }
  };

  return {
    handleDeleteBanner,
    isLoading: isLoadingBanner,
  };
}
