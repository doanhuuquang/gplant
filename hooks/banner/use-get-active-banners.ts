"use client";

import { useEffect } from "react";
import { useBannerStore } from "@/stores/banner-store";

export function useGetActiveBanners() {
  const { activeBanners, bannerError, isLoadingBanner, fetchActiveBanners } =
    useBannerStore();

  useEffect(() => {
    if (!activeBanners?.length) {
      fetchActiveBanners();
    }
  }, [activeBanners?.length, fetchActiveBanners]);

  return {
    activeBanners,
    isLoadingBanner,
    bannerError,
  };
}
