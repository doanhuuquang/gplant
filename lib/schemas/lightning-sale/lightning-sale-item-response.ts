import PlantResponse from "@/lib/schemas/plant/plant-response";
import { PlantVariantResponse } from "@/lib/schemas/plant/plant-variant-response";

export interface LightningSaleItemResponse {
  id: string;
  lightningSaleId: string;
  plant: PlantResponse;
  salePlantVariant: PlantVariantResponse | null;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  savedAmount: number;
  quantityLimit: number;
  quantitySold: number;
  quantityRemaining: number;
  soldPercentage: number;
  isSoldOut: boolean;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}
