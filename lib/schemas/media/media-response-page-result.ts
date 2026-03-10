import MediaResponse from "@/lib/schemas/media/media-response";

export default interface MediaResponsePageResult {
  items: MediaResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
