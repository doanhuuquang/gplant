"use client";

import Banner from "@/lib/models/banner";

import { create } from "zustand";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { getActiveBanners } from "@/services/banner-service";

type BannerState = {
  activeBanners: Banner[];
  isLoadingBanner: boolean;
  bannerError: string | null;
};

type BannerActions = {
  reset: () => void;
  fetchActiveBanners: () => Promise<void>;
};

export const useBannerStore = create<BannerState & BannerActions>((set) => ({
  activeBanners: [],
  isLoadingBanner: false,
  bannerError: null,

  reset: () =>
    set({
      activeBanners: [],
      isLoadingBanner: false,
      bannerError: null,
    }),

  fetchActiveBanners: async () => {
    try {
      set({ isLoadingBanner: true, bannerError: null, activeBanners: [] });
      const response = await getActiveBanners();
      set({
        activeBanners: (response.data as Banner[]) ?? [],
        bannerError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ bannerError: err.message, activeBanners: [] });
    } finally {
      set({ isLoadingBanner: false });
    }
  },
}));
