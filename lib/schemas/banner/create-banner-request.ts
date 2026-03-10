import { BannerGroup } from "@/lib/enums/banner-group";

export interface CreateBannerRequest {
  title: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
  group: BannerGroup;
  orderIndex?: number;
  mediaId?: string;
  isActive: boolean;
}
