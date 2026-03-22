"use client";

import UpdateCartItemRequest from "@/lib/schemas/cart/update-cart-item-request";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";

export function useUpdateCartItemQuantity() {
  const { isUpdatingCartItem, updateCartItem } = useCartStore();

  const handleUpdateQuantity = async (
    cartItemId: string,
    request: UpdateCartItemRequest,
  ) => {
    try {
      await updateCartItem(cartItemId, request);
      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update quantity failed", {
        description:
          err.message ?? "Could not update item quantity. Please try again.",
      });

      return false;
    }
  };

  return { handleUpdateQuantity, isUpdatingCartItem };
}
