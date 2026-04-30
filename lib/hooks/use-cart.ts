import { AddItemToCartRequest, UpdateCartItemRequest } from "@/types/cart";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  syncPrices,
  addItemToCart,
  updateCartItem,
  removeCartItem,
} from "@/lib/api/cart";

export const cartQueryKey = {
  all: ["cart"] as const,
};

export function useCart() {
  return useQuery({
    queryKey: cartQueryKey.all,
    queryFn: getCart,
  });
}

export function useSyncCartPrices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncPrices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey.all });
    },
  });
}

export function useAddItemToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddItemToCartRequest) => addItemToCart(input),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey.all });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cartItemId,
      request,
    }: {
      cartItemId: string;
      request: UpdateCartItemRequest;
    }) => updateCartItem(cartItemId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey.all });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId: string) => removeCartItem(cartItemId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: cartQueryKey.all });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}
