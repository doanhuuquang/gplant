import PlantResponse from "@/lib/schemas/plant/plant-response";

export default interface PlantResponsePageResult {
  items: PlantResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
