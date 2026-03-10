"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useBannerStore } from "@/stores/banner-store";
import { toast } from "sonner";

export function useToggleActiveBanner() {
  const { toggleActiveBanner, isLoadingBanner } = useBannerStore();

  const handleToggleActiveBanner = async (id: string) => {
    try {
      await toggleActiveBanner(id);

      toast.success("Banner updated", {
        description: "Banner status has been updated successfully.",
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update banner status.",
      });
    }
  };

  return {
    handleToggleActiveBanner,
    isLoading: isLoadingBanner,
  };
}
