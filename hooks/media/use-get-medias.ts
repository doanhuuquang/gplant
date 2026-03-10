"use client";

import { useMediaStore } from "@/stores/media-store";
import { useEffect } from "react";

export function useGetMedias() {
  const {
    medias,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    isLoading,
    mediaError,
    fetchMedias,
    setPageNumber,
    setPageSize,
  } = useMediaStore();

  useEffect(() => {
    fetchMedias();
  }, [fetchMedias, pageNumber, pageSize]);

  return {
    medias,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    isLoading,
    mediaError,
    setPageNumber,
    setPageSize,
  };
}
