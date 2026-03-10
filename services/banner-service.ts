import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import { CreateBannerRequest } from "@/lib/schemas/banner/create-banner-request";
import { UpdateBannerRequest } from "@/lib/schemas/banner/update-banner-request";

const BANNER_URL = "/api/banners";

const getBanners = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(BANNER_URL);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getActiveBanners = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${BANNER_URL}/active`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const createBannerApi = async (
  request: CreateBannerRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(BANNER_URL, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updateBannerApi = async (
  id: string,
  request: UpdateBannerRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.put(`${BANNER_URL}/${id}`, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deleteBannerApi = async (id: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(`${BANNER_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const toggleActiveBannerApi = async (
  id: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${BANNER_URL}/${id}/toggle-active`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  getBanners,
  getActiveBanners,
  createBannerApi,
  updateBannerApi,
  deleteBannerApi,
  toggleActiveBannerApi,
};
