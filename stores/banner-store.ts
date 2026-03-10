"use client";

import BannerResponse from "@/lib/schemas/banner/banner-response";
import { create } from "zustand";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { CreateBannerRequest } from "@/lib/schemas/banner/create-banner-request";
import { UpdateBannerRequest } from "@/lib/schemas/banner/update-banner-request";
import {
  getBanners,
  getActiveBanners,
  createBannerApi,
  updateBannerApi,
  deleteBannerApi,
  toggleActiveBannerApi,
} from "@/services/banner-service";

type BannerState = {
  banners: BannerResponse[];
  activeBanners: BannerResponse[];
  isLoadingBanner: boolean;
  bannerError: string | null;
};

type BannerActions = {
  reset: () => void;
  fetchBanners: () => Promise<void>;
  fetchActiveBanners: () => Promise<void>;
  createBanner: (request: CreateBannerRequest) => Promise<void>;
  updateBanner: (id: string, request: UpdateBannerRequest) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  toggleActiveBanner: (id: string) => Promise<void>;
};

export const useBannerStore = create<BannerState & BannerActions>(
  (set, get) => ({
    banners: [],
    activeBanners: [],
    isLoadingBanner: false,
    bannerError: null,

    reset: () =>
      set({
        banners: [],
        activeBanners: [],
        isLoadingBanner: false,
        bannerError: null,
      }),

    fetchBanners: async () => {
      try {
        set({ isLoadingBanner: true, bannerError: null });
        const response = await getBanners();
        set({
          banners: (response.data as BannerResponse[]) ?? [],
          bannerError: null,
        });
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ bannerError: err.message, banners: [] });
      } finally {
        set({ isLoadingBanner: false });
      }
    },

    fetchActiveBanners: async () => {
      try {
        set({ isLoadingBanner: true, bannerError: null, activeBanners: [] });
        const response = await getActiveBanners();
        set({
          activeBanners: (response.data as BannerResponse[]) ?? [],
          bannerError: null,
        });
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ bannerError: err.message, activeBanners: [] });
      } finally {
        set({ isLoadingBanner: false });
      }
    },

    createBanner: async (request: CreateBannerRequest) => {
      try {
        set({ isLoadingBanner: true, bannerError: null });
        await createBannerApi(request);
        await get().fetchBanners();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ bannerError: err.message });
        throw e;
      } finally {
        set({ isLoadingBanner: false });
      }
    },

    updateBanner: async (id: string, request: UpdateBannerRequest) => {
      try {
        set({ isLoadingBanner: true, bannerError: null });
        await updateBannerApi(id, request);
        await get().fetchBanners();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ bannerError: err.message });
        throw e;
      } finally {
        set({ isLoadingBanner: false });
      }
    },

    deleteBanner: async (id: string) => {
      try {
        set({ isLoadingBanner: true, bannerError: null });
        await deleteBannerApi(id);
        await get().fetchBanners();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ bannerError: err.message });
        throw e;
      } finally {
        set({ isLoadingBanner: false });
      }
    },

    toggleActiveBanner: async (id: string) => {
      try {
        set({ isLoadingBanner: true, bannerError: null });
        await toggleActiveBannerApi(id);
        await get().fetchBanners();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ bannerError: err.message });
        throw e;
      } finally {
        set({ isLoadingBanner: false });
      }
    },
  }),
);
