import { OrderStatus } from "@/lib/enums/order-status";
import { PaymentMethod } from "@/lib/enums/payment-method";
import { PaymentStatus } from "@/lib/enums/payment-status";
import { PlantResponse } from "@/types/plant";
import { UserResponse } from "@/types/user";
import {
  CancelOrderRequestValidation,
  UpdateOrderStatusRequestValidation,
} from "@/validations/order";
import z from "zod";

export interface OrderResponsePageResult {
  items: OrderResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  todayOrderCount: number;
  todayRevenue: number;
  pendingOrderCount: number;
  deliveringOrderCount: number;
}

export interface OrderItemResponse {
  id: string;
  orderId: string;
  plant: PlantResponse;
  plantVariantId: string;
  PlantName: string;
  variantSKU: string;
  variantSize: number;
  quantity: number;
  price: number;
  salePrice: number;
  finalPrice: number;
  subTotal: number;
  discountAmount: number;
  wasOnSale: boolean;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  user: UserResponse;
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
  status: string;
  statusDisplay: string;
  cancellationReason?: string | null;
  cancelledAtUtc?: string | null;
  items: OrderItemResponse[];
  totalItems: number;
  canCancel: boolean;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}

export interface CreateOrderResponse {
  order: OrderResponse;
  paymentUrl?: string;
  qrCodeBase64?: string;
  requiresPayment: boolean;
  paymentExpireAtUtc?: string;
}

export interface OrderFilterRequest {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fromDate?: Date;
  toDate?: Date;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

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

export type UpdateOrderStatusRequest = z.infer<
  typeof UpdateOrderStatusRequestValidation
>;
export type CancelOrderRequest = z.infer<typeof CancelOrderRequestValidation>;
