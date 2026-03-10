import PlantResponse from "@/lib/schemas/plant/plant-response";
import { PlantVariantResponse } from "@/lib/schemas/plant/plant-variant-response";

export default interface CartItemResponse {
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
