import { apiClient } from "./client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import {
  BannerResponse,
  CreateBannerRequest,
  UpdateBannerRequest,
} from "@/types/banner";

export const getBanners = async () => {
  try {
    const { data } =
      await apiClient.get<SuccessResponse<BannerResponse[]>>("/banners");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getActiveBanners = async () => {
  try {
    const { data } =
      await apiClient.get<SuccessResponse<BannerResponse[]>>("/banners/active");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createBanner = async (request: CreateBannerRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<null>>(
      "/banners",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateBanner = async (
  id: string,
  request: UpdateBannerRequest,
) => {
  try {
    const { data } = await apiClient.put<SuccessResponse<null>>(
      `/banners/${id}`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteBanner = async (id: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/banners/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const toggleActiveBanner = async (id: string) => {
  try {
    const { data } = await apiClient.patch<SuccessResponse<null>>(
      `/banners/${id}/toggle-active`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
