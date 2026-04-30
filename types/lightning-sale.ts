import z from "zod";
import {
  CreateLightningSaleItemRequestValidation,
  CreateLightningSaleRequestValidation,
  UpdateLightningSaleItemRequestValidation,
  UpdateLightningSaleRequestValidation,
} from "@/validations/lightning-sale";
import { PlantResponse, PlantVariantResponse } from "@/types/plant";

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

export interface LightningSaleResponse {
  id: string;
  name: string;
  description: string;
  startDateUtc: string;
  endDateUtc: string;
  isActive: boolean;
  isUpcoming: boolean;
  isOngoing: boolean;
  isExpired: boolean;
  timeRemaining: string | null;
  items: LightningSaleItemResponse[];
  totalItems: number;
  activeItems: number;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export type CreateLightningSaleRequest = z.infer<
  typeof CreateLightningSaleRequestValidation
>;
export type UpdateLightningSaleRequest = z.infer<
  typeof UpdateLightningSaleRequestValidation
>;
export type CreateLightningSaleItemRequest = z.infer<
  typeof CreateLightningSaleItemRequestValidation
>;
export type UpdateLightningSaleItemRequest = z.infer<
  typeof UpdateLightningSaleItemRequestValidation
>;
