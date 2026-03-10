import { PlantVariantResponse } from "@/lib/schemas/plant/plant-variant-response";
import { PlantImageResponse } from "@/lib/schemas/plant/plant-image-response";
import CategoryResponse from "@/lib/schemas/category/category-response";
import CareInstructionResponse from "@/lib/schemas/care-instruction.ts/care-instruction-response";

export default interface PlantResponse {
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
