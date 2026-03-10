"use client";

import { useEffect } from "react";
import { useLightningSaleStore } from "@/stores/lightning-sale-store";

export function useGetLightningSales() {
  const {
    lightningSales,
    isLoadingLightningSale,
    lightningSaleError,
    fetchLightningSales,
  } = useLightningSaleStore();

  useEffect(() => {
    if (!lightningSales?.length) {
      fetchLightningSales();
    }
  }, [lightningSales?.length, fetchLightningSales]);

  return {
    lightningSales,
    isLoading: isLoadingLightningSale,
    lightningSaleError,
  };
}
