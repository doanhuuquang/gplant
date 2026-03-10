import { PlantVariantResponse } from "@/lib/schemas/plant/plant-variant-response";

export default interface InventoryResponse {
  id: string;
  plantVariantId: string;
  plantVariant: PlantVariantResponse | null;
  quantityAvailable: number;
  quantityReserved: number;
  totalQuantity: number;
  isInStock: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
  lastUpdatedAtUtc: string;
}
