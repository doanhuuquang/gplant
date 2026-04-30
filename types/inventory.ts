import z from "zod";
import { PlantVariantResponse } from "@/types/plant";
import {
  AdjustInventoryRequestValidation,
  CreateInventoryRequestValidation,
  UpdateInventoryRequestValidation,
} from "@/validations/inventory";

export interface InventoryResponse {
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

export type CreateInventoryRequest = z.infer<
  typeof CreateInventoryRequestValidation
>;
export type UpdateInventoryRequest = z.infer<
  typeof UpdateInventoryRequestValidation
>;
export type AdjustInventoryRequest = z.infer<
  typeof AdjustInventoryRequestValidation
>;
