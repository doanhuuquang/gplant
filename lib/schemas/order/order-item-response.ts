import PlantResponse from "@/lib/schemas/plant/plant-response";

export interface OrderItemResponse {
  id: string;
  orderId: string;
  plant: PlantResponse;
  plantVariantId: string;
  PlantName: string;
  variantSKU: string;
  variantSize: number;
  quantity: number;
  price: number;
  salePrice: number;
  finalPrice: number;
  subTotal: number;
  discountAmount: number;
  wasOnSale: boolean;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}
