import { BannerGroup } from "@/lib/enums/banner-group";
import { MediaResponse } from "@/types/media";
import {
  CreateBannerRequestValidation,
  UpdateBannerRequestValidation,
} from "@/validations/banner";
import z from "zod";

export interface BannerResponse {
  id: string;
  title: string;
  description: string;
  media: MediaResponse | null;
  redirectUrl: string;
  group: BannerGroup;
  orderIndex: number;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export type CreateBannerRequest = z.infer<typeof CreateBannerRequestValidation>;
export type UpdateBannerRequest = z.infer<typeof UpdateBannerRequestValidation>;
