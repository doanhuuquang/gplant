export interface CreatePlantRequest {
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  careInstructionId: string;
  isActive: boolean;
}
