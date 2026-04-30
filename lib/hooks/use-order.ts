import { APP_PATHS } from "@/lib/constants/app-paths";
import {
  CancelOrderRequest,
  CreateOrderRequest,
  OrderFilterRequest,
  UpdateOrderStatusRequest,
} from "@/types/order";
import { PaymentMethod } from "@/lib/enums/payment-method";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getMyOrders,
  placeOrder,
  getQRPaymentByOrderId,
  getVNPayUrlByOrderId,
  getOrderByOrderNumber,
  cancelOrder,
  getOrders,
  updateOrderStatus,
} from "@/lib/api/order";

export const orderKeys = {
  all: ["orders"] as const,
  list: (params: OrderFilterRequest) => ["orders", params] as const,
  orderByNumber: (orderNumber: string) =>
    ["orders", "number", orderNumber] as const,
  allMyOrders: ["myOrders"] as const,
  listMyOrders: (params: OrderFilterRequest) => ["myOrders", params] as const,
  myOrderByNumber: (orderNumber: string) =>
    ["myOrders", "number", orderNumber] as const,
};

export const useOrders = (params: OrderFilterRequest) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
  });
};

export const useMyOrders = (params: OrderFilterRequest) => {
  return useQuery({
    queryKey: orderKeys.listMyOrders(params),
    queryFn: () => getMyOrders(params),
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (request: CreateOrderRequest) => placeOrder(request),
    onSuccess: (response, Variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.allMyOrders });
      toast.success("Thành công", { description: response?.message });

      if (
        Variables.paymentMethod === PaymentMethod.VNPay &&
        response.data.paymentUrl
      )
        router.push(response.data.paymentUrl);
      else
        router.push(
          `${APP_PATHS.SHOP_ORDER_CONFIRMATION}?order=${response.data.order.orderNumber}`,
        );
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useQRPaymentByOrderId = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: ["orders", orderId, "qr-payment"],
    queryFn: () => getQRPaymentByOrderId(orderId),
    enabled: !!orderId && enabled,
  });
};

export const useVNPayUrlByOrderId = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: ["orders", orderId, "vnpay-url"],
    queryFn: () => getVNPayUrlByOrderId(orderId),
    enabled: !!orderId && enabled,
  });
};

export const useOrderByOrderNumber = (orderNumber: string, enabled = true) => {
  return useQuery({
    queryKey: orderKeys.myOrderByNumber(orderNumber),
    queryFn: () => getOrderByOrderNumber(orderNumber),
    enabled: !!orderNumber && enabled,
  });
};

export const useUpdateOrderStatus = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateOrderStatusRequest) =>
      updateOrderStatus(orderId, request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.allMyOrders });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useCancelOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CancelOrderRequest) => cancelOrder(orderId, request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.allMyOrders });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};
