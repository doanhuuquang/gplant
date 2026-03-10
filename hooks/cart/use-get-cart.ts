"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

export function useGetCart() {
  const { cart, cartError, isLoadingCart, fetchCart } = useCartStore();

  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, [fetchCart, cart]);

  return {
    cart,
    cartError,
    isLoadingCart,
  };
}
