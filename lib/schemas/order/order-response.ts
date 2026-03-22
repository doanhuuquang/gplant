import { OrderStatus } from "@/lib/enums/order-status";
import { PaymentMethod } from "@/lib/enums/payment-method";
import { PaymentStatus } from "@/lib/enums/payment-status";
import { OrderItemResponse } from "@/lib/schemas/order/order-item-response";

export interface OrderResponse {
  id: string;
  orderNumber: string;
  userId: string;
  shippingName: string;
  shippingPhone: string;
  address: string;
  buildingName: string;
  longitude: string;
  latitude: string;
  shippingNote?: string | null;
  subTotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentMethodDisplay: string;
  paymentStatus: PaymentStatus;
  paymentStatusDisplay: string;
  paidAtUtc?: string | null;
  status: OrderStatus;
  statusDisplay: string;
  cancellationReason?: string | null;
  cancelledAtUtc?: string | null;
  items: OrderItemResponse[];
  totalItems: number;
  canCancel: boolean;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}
