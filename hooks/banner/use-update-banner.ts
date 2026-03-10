"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useBannerStore } from "@/stores/banner-store";
import { UpdateBannerRequest } from "@/lib/schemas/banner/update-banner-request";
import { toast } from "sonner";

export function useUpdateBanner() {
  const { updateBanner, isLoadingBanner } = useBannerStore();

  const handleUpdateBanner = async (
    id: string,
    request: UpdateBannerRequest,
  ) => {
    try {
      await updateBanner(id, request);

      toast.success("Banner updated", {
        description: "Banner has been updated successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update banner.",
      });

      return false;
    }
  };

  return {
    handleUpdateBanner,
    isLoading: isLoadingBanner,
  };
}
