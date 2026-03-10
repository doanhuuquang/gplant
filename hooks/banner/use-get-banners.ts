"use client";

import { useEffect } from "react";
import { useBannerStore } from "@/stores/banner-store";

export function useGetBanners() {
  const { banners, isLoadingBanner, bannerError, fetchBanners } =
    useBannerStore();

  useEffect(() => {
    if (!banners?.length) {
      fetchBanners();
    }
  }, [banners?.length, fetchBanners]);

  return {
    banners,
    isLoading: isLoadingBanner,
    bannerError,
  };
}
