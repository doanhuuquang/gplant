import { BannerGroup } from "@/lib/enums/banner-group";
import MediaResponse from "@/lib/schemas/media/media-response";

export default interface BannerResponse {
  id: string;
  title: string;
  media: MediaResponse | null;
  redirectUrl: string;
  group: BannerGroup;
  orderIndex: number;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}
