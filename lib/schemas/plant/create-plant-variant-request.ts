export interface CreatePlantVariantRequest {
  plantId: string;
  sku: string;
  price: number;
  size: number;
  isActive: boolean;
}
