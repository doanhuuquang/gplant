"use client";

import { useEffect, useState } from "react";
import { usePlantStore } from "@/stores/plant-store";
import PlantResponse from "@/lib/schemas/plant/plant-response";

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
    const getPlants = async () => {
      await fetchPlants();
    };

    getPlants();
  }, [pageNumber, pageSize]);

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
