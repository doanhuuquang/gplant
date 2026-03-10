"use client";

import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import AddToCartRequest from "@/lib/schemas/cart/add-to-cart-request";

export function useAddToCart() {
  const { addToCart, isAddingToCart } = useCartStore();

  const handleAddToCart = async (request: AddToCartRequest) => {
    try {
      await addToCart(request);

      toast.success("Added to cart!", {
        description: "Your item has been added to the cart successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Add to cart failed", {
        description:
          err.message ?? "Could not add item to cart. Please try again.",
      });

      return false;
    }
  };

  return { handleAddToCart, isAddingToCart };
}
