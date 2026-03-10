import MediaResponse from "@/lib/schemas/media/media-response";

export interface PlantImageResponse {
  id: string;
  plantId: string;
  media?: MediaResponse | null;
  isPrimary: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}
