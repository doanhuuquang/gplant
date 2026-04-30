import { MediaResponse } from "@/types/media";
import {
  CreateCategoryRequestValidation,
  UpdateCategoryRequestValidation,
} from "@/validations/category";
import z from "zod";

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  media: MediaResponse;
  parentId?: string;
  isActive: boolean;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}

export type CreateCategoryRequest = z.infer<
  typeof CreateCategoryRequestValidation
>;
export type UpdateCategoryRequest = z.infer<
  typeof UpdateCategoryRequestValidation
>;
