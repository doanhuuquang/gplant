import { BannerGroup } from "@/lib/enums/banner-group";

export interface UpdateBannerRequest {
  title?: string;
  description?: string;
  imageUrl?: string;
  redirectUrl?: string;
  mediaId?: string;
  group?: BannerGroup;
  orderIndex?: number;
  isActive?: boolean;
}
