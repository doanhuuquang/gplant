"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useBannerStore } from "@/stores/banner-store";
import { CreateBannerRequest } from "@/lib/schemas/banner/create-banner-request";
import { toast } from "sonner";

export function useCreateBanner() {
  const { createBanner, isLoadingBanner } = useBannerStore();

  const handleCreateBanner = async (request: CreateBannerRequest) => {
    try {
      await createBanner(request);

      toast.success("Banner created", {
        description: "Banner has been created successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Create failed", {
        description: err.message ?? "Failed to create banner.",
      });

      return false;
    }
  };

  return {
    handleCreateBanner,
    isLoading: isLoadingBanner,
  };
}
