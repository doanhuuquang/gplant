import ShippingAddressResponse from "@/lib/schemas/shipping-address/shipping-address-response";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { CreateOrderRequest } from "@/lib/schemas/order/create-order-rquest";
import { PaymentMethod } from "@/lib/enums/payment-method";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { useOrderStore } from "@/stores/order-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateOrderResponse } from "@/lib/schemas/order/create-order-response";

export function usePlaceOrder() {
  const router = useRouter();
  const { placeOrder, isPlacingOrder, orderError } = useOrderStore();
  const { fetchCart } = useCartStore();

  const [createOrderResponse, setCreateOrderResponse] =
    useState<CreateOrderResponse | null>(null);

  const handlePlaceOrder = async (
    shippingAddress?: ShippingAddressResponse | null,
    paymentMethod?: PaymentMethod | null,
    note?: string,
  ) => {
    try {
      if (!shippingAddress || !paymentMethod) return;

      const request: CreateOrderRequest = {
        shippingName: shippingAddress.shippingName,
        shippingPhone: shippingAddress.shippingPhone,
        address: shippingAddress.address,
        buildingName: shippingAddress.buildingName,
        longitude: shippingAddress.longitude,
        latitude: shippingAddress.latitude,
        shippingNote: note,
        paymentMethod: paymentMethod,
      };

      const response = await placeOrder(request);
      if (response) setCreateOrderResponse(response);

      await fetchCart();

      toast.success("Order placed", {
        description: "Your order has been placed successfully.",
      });

      router.push(
        paymentMethod === PaymentMethod.COD ||
          paymentMethod === PaymentMethod.BankTransfer
          ? `${APP_PATHS.SHOP_ORDER_CONFIRMATION}?status=success&order=${response?.order.orderNumber}`
          : (response?.paymentUrl ?? ""),
      );
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Place order failed", {
        description: err.message ?? "Failed to place order.",
      });
    }
  };

  return {
    handlePlaceOrder,
    createOrderResponse,
    isPlacingOrder,
    orderError,
  };
}
