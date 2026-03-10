"use client";

import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import AddToCartRequest from "@/lib/schemas/cart/add-to-cart-request";
import CartResponse from "@/lib/schemas/cart/cart-response";
import { addToCartAPI, getCart, syncPrices } from "@/services/cart-service";
import { create } from "zustand";

type CartState = {
  cart: CartResponse | null;
  isLoadingCart: boolean;
  isAddingToCart: boolean;
  cartError: string | null;
};

type CartActions = {
  reset: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (request: AddToCartRequest) => Promise<void>;
};

export const useCartStore = create<CartState & CartActions>((set, get) => ({
  cart: null,
  isLoadingCart: false,
  isAddingToCart: false,
  cartError: null,

  reset: () =>
    set({
      cart: null,
      isLoadingCart: false,
      cartError: null,
    }),

  fetchCart: async () => {
    try {
      set({ isLoadingCart: true, cartError: null });
      const response = await getCart();
      await syncPrices();
      set({
        cart: (response.data as CartResponse) ?? null,
        cartError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ cartError: err.message, cart: null });
    } finally {
      set({ isLoadingCart: false });
    }
  },

  addToCart: async (request: AddToCartRequest) => {
    try {
      set({ isAddingToCart: true, cartError: null });
      const response = await addToCartAPI(request);
      set({
        cart: (response.data as CartResponse) ?? null,
        cartError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ cartError: err.message, cart: null });
      throw err;
    } finally {
      set({ isAddingToCart: false });
    }
  },
}));
