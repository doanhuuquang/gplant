import { BannerGroup } from "@/lib/enums/banner-group";

export default interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
  group: BannerGroup;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
