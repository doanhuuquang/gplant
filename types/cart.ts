import z from "zod";
import { PlantResponse, PlantVariantResponse } from "@/types/plant";
import {
  AddItemToCartRequestValidation,
  UpdateCartItemRequestValidation,
} from "@/validations/cart";

export interface CartItemResponse {
  id: string;
  cartId: string;
  plantVariantId: string;
  plantVariant: PlantVariantResponse;
  plant: PlantResponse;
  quantity: number;
  price: number;
  salePrice: number | null;
  discountPercentage: number | null;
  finalPrice: number;
  totalPrice: number;
  discountAmount: number;
  isOnSale: boolean;
  isInStock: boolean;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItemResponse[];
  totalItems: number;
  subTotal: number;
  totalDiscount: number;
  total: number;
  shippingCost: number;
  createdAtUrc: Date;
  updatedAtUtc: Date;
}

export type AddItemToCartRequest = z.infer<
  ReturnType<typeof AddItemToCartRequestValidation>
>;
export type UpdateCartItemRequest = z.infer<
  ReturnType<typeof UpdateCartItemRequestValidation>
>;
