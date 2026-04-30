import { CareInstructionResponse } from "@/types/care-instruction";
import { CategoryResponse } from "@/types/category";
import { MediaResponse } from "@/types/media";
import {
  CreatePlantRequestValidation,
  CreatePlantVariantRequestValidation,
  UpdatePlantRequestValidation,
  UpdatePlantVariantRequestValidation,
} from "@/validations/plant";
import z from "zod";

export interface PlantImageResponse {
  id: string;
  plantId: string;
  media?: MediaResponse | null;
  isPrimary: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface PlantVariantResponse {
  id: string;
  plantId: string;
  sku: string;
  price: number;
  size: number;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface PlantResponse {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: CategoryResponse;
  careInstruction?: CareInstructionResponse | null;
  variants: PlantVariantResponse[];
  images: PlantImageResponse[];
  minPrice?: number | null;
  maxPrice?: number | null;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface PlantResponsePageResult {
  items: PlantResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type CreatePlantRequest = z.infer<typeof CreatePlantRequestValidation>;
export type UpdatePlantRequest = z.infer<typeof UpdatePlantRequestValidation>;
export type CreatePlantVariantRequest = z.infer<
  typeof CreatePlantVariantRequestValidation
>;
export type UpdatePlantVariantRequest = z.infer<
  typeof UpdatePlantVariantRequestValidation
>;

export interface CreatePlantImageRequest {
  plantId: string;
  mediaId: string;
  isPrimary: boolean;
}
