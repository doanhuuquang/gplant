"use client";

import { useEffect } from "react";
import { usePlantStore } from "@/stores/plant-store";

export function useGetPlants() {
  const {
    plants,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    isLoading,
    plantError,
    fetchPlants,
    setPageNumber,
    setPageSize,
  } = usePlantStore();

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants, pageNumber, pageSize]);

  return {
    plants,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    isLoading,
    plantError,
    setPageNumber,
    setPageSize,
  };
}
