"use client";

import { useEffect } from "react";
import { useLightningSaleStore } from "@/stores/lightning-sale-store";

export function useGetOngoingLightningSales() {
  const {
    ongoingLightningSales,
    isLoadingLightningSale,
    lightningSaleError,
    fetchOngoingLightningSales,
  } = useLightningSaleStore();

  useEffect(() => {
    fetchOngoingLightningSales();
  }, [fetchOngoingLightningSales]);

  return {
    ongoingLightningSales,
    isLoading: isLoadingLightningSale,
    lightningSaleError,
  };
}
