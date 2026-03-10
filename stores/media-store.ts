"use client";

import MediaResponse from "@/lib/schemas/media/media-response";
import MediaResponsePageResult from "@/lib/schemas/media/media-response-page-result";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { create } from "zustand";
import { deleteMedia, getMedias, uploadMedia } from "@/services/media-service";

type MediaState = {
  medias: MediaResponse[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isLoading: boolean;
  mediaError: string | null;
};

type MediaActions = {
  reset: () => void;
  fetchMedias: () => Promise<void>;
  setPageNumber: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;
  deleteMedia: (mediaId: string) => Promise<boolean>;
  uploadMedia: (file: File) => Promise<boolean>;
};

export const useMediaStore = create<MediaState & MediaActions>((set, get) => ({
  medias: [],
  pageNumber: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  isLoading: false,
  mediaError: null,

  reset: () =>
    set({
      medias: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
      isLoading: false,
      mediaError: null,
    }),

  fetchMedias: async () => {
    const { pageNumber, pageSize } = get();
    try {
      set({ isLoading: true, mediaError: null });
      const response = await getMedias(pageNumber, pageSize);
      const data = response.data as MediaResponsePageResult;
      set({
        medias: data?.items ?? [],
        totalCount: data?.totalCount ?? 0,
        totalPages: data?.totalPages ?? 0,
        hasPreviousPage: data?.hasPreviousPage ?? false,
        hasNextPage: data?.hasNextPage ?? false,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ mediaError: err.message, medias: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  setPageNumber: (pageNumber: number) => {
    const { totalPages } = get();
    if (pageNumber < 1 || pageNumber > totalPages) return;
    set({ pageNumber });
  },

  setPageSize: (pageSize: number) => {
    set({ pageSize, pageNumber: 1 });
  },

  deleteMedia: async (mediaId: string): Promise<boolean> => {
    try {
      set({ isLoading: true, mediaError: null });
      await deleteMedia(mediaId);
      await get().fetchMedias();
      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ mediaError: err.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  uploadMedia: async (file: File): Promise<boolean> => {
    try {
      set({ isLoading: true, mediaError: null });
      await uploadMedia(file);
      await get().fetchMedias();
      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ mediaError: err.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },
}));
