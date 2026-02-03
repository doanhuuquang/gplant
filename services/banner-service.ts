import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";

const GET_ACTIVE_BANNERS_URL = "/api/banners/active";

const getActiveBanners = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(GET_ACTIVE_BANNERS_URL);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export { getActiveBanners };
