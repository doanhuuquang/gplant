import CartItemResponse from "@/lib/schemas/cart/cart-item-response";

export default interface CartResponse {
  id: string;
  userId: string;
  items: CartItemResponse[];
  totalItems: number;
  subTotal: number;
  totalDiscount: number;
  total: number;
  treatedAtUtc: Date;
  updatedAtUtc: Date;
}
