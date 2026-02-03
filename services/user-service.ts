import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";

const ME_URL = "/api/users/me";

const me = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(ME_URL);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export { me };
