import { OrderStatus } from "@/lib/enums/order-status";
import { PaymentStatus } from "@/lib/enums/payment-status";

export interface OrderFilterRequest {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fromDate?: Date;
  toDate?: Date;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}
