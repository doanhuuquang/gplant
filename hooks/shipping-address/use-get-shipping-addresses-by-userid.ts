"use client";

import { useShippingAddressStore } from "@/stores/shipping-address-store";
import { useEffect } from "react";

export function useGetShippingAddressesByUserId(userId: string) {
  const {
    fetchShippingAddresses,
    shippingAddresses,
    isLoadingShippingAddress,
  } = useShippingAddressStore();

  useEffect(() => {
    if (shippingAddresses.length === 0) fetchShippingAddresses(userId);
  }, [userId, fetchShippingAddresses, shippingAddresses.length]);

  return {
    shippingAddresses,
    isLoadingShippingAddress,
  };
}
