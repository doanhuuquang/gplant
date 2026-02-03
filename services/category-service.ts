import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";

const GET_ACTIVE_CATEGORIES_URL = "/api/categories/active";

const getActiveCategories = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(GET_ACTIVE_CATEGORIES_URL);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export { getActiveCategories };
