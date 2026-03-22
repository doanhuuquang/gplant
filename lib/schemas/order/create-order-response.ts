import { OrderResponse } from "@/lib/schemas/order/order-response";

export interface CreateOrderResponse {
  order: OrderResponse;
  paymentUrl?: string;
  qrCodeBase64?: string;
  requiresPayment: boolean;
  paymentExpireAtUtc?: string;
}
