"use client";

import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";

export function useRemoveCartItem() {
  const { removeCartItem, isRemovingCartItem } = useCartStore();

  const handleRemoveCartItem = async (cartItemId: string) => {
    try {
      await removeCartItem(cartItemId);

      toast.success("Item removed", {
        description: "The item has been removed from your cart.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Remove item failed", {
        description:
          err.message ?? "Could not remove item from cart. Please try again.",
      });

      return false;
    }
  };

  return { handleRemoveCartItem, isRemovingCartItem };
}
