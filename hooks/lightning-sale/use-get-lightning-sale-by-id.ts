"use client";

import { useEffect } from "react";
import { useLightningSaleStore } from "@/stores/lightning-sale-store";

export function useGetLightningSaleById(id: string) {
  const {
    currentSale,
    isLoadingLightningSale,
    lightningSaleError,
    fetchLightningSaleById,
  } = useLightningSaleStore();

  useEffect(() => {
    if (id) {
      fetchLightningSaleById(id);
    }
  }, [id, fetchLightningSaleById]);

  return {
    sale: currentSale,
    isLoading: isLoadingLightningSale,
    error: lightningSaleError,
  };
}
