import { OrderResponse } from "@/lib/schemas/order/order-response";

export interface OrderResponsePageResult {
  items: OrderResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
