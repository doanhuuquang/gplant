import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";

const MEDIAS_URL = "/api/medias";
const UPLOAD_MEDIA_URL = `${MEDIAS_URL}/upload`;

const getMedias = async (
  pageNumber: number,
  pageSize: number,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(MEDIAS_URL, {
      params: {
        pageNumber,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deleteMedia = async (mediaId: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(`${MEDIAS_URL}/${mediaId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const uploadMedia = async (file: File): Promise<ApiSuccessResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(UPLOAD_MEDIA_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export { getMedias, deleteMedia, uploadMedia };
