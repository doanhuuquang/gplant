import MediaResponse from "@/lib/schemas/media/media-response";

export default interface CategoryResponse {
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
