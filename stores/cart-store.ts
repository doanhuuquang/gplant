"use client";

import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import AddToCartRequest from "@/lib/schemas/cart/add-to-cart-request";
import CartResponse from "@/lib/schemas/cart/cart-response";
import UpdateCartItemRequest from "@/lib/schemas/cart/update-cart-item-request";
import {
  addToCartAPI,
  getCart,
  removeCartItemAPI,
  syncPrices,
  updateCartItemAPI,
} from "@/services/cart-service";
import { is } from "zod/v4/locales";
import { create } from "zustand";

type CartState = {
  cart: CartResponse | null;
  isLoadingCart: boolean;
  isAddingToCart: boolean;
  isUpdatingCartItem: boolean;
  isRemovingCartItem: boolean;
  cartError: string | null;
};

type CartActions = {
  reset: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (request: AddToCartRequest) => Promise<void>;
  updateCartItem: (
    cartItemId: string,
    request: UpdateCartItemRequest,
  ) => Promise<void>;
  removeCartItem: (cartItemId: string) => Promise<void>;
};

export const useCartStore = create<CartState & CartActions>((set, get) => ({
  cart: null,
  isLoadingCart: false,
  isAddingToCart: false,
  isUpdatingCartItem: false,
  isRemovingCartItem: false,
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
      set({ cartError: err.message});
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
      set({ cartError: err.message});
      throw err;
    } finally {
      set({ isAddingToCart: false });
    }
  },

  updateCartItem: async (
    cartItemId: string,
    request: UpdateCartItemRequest,
  ) => {
    try {
      set({ isUpdatingCartItem: true, cartError: null });
      const response = await updateCartItemAPI(cartItemId, request);
      set({
        cart: (response.data as CartResponse) ?? null,
        cartError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ cartError: err.message});
      throw err;
    } finally {
      set({ isUpdatingCartItem: false });
    }
  },

  removeCartItem: async (cartItemId: string) => {
    try {
      set({ isRemovingCartItem: true, cartError: null });
      await removeCartItemAPI(cartItemId);

      set((state) => ({
        cart: state.cart
          ? {
              ...state.cart,
              items: state.cart.items.filter((item) => item.id !== cartItemId),
            }
          : null,
        cartError: null,
      }));
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ cartError: err.message});
      throw err;
    } finally {
      set({ isRemovingCartItem: false });
    }
  },
}));
