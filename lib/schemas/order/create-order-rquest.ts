import { PaymentMethod } from "@/lib/enums/payment-method";

export interface CreateOrderRequest {
  shippingName: string;
  shippingPhone: string;
  address: string;
  buildingName: string;
  longitude: string;
  latitude: string;
  shippingNote?: string;
  paymentMethod: PaymentMethod;
}
