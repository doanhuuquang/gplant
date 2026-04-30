import { apiClient } from "./client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import { MediaResponse, MediaResponsePageResult } from "@/types/media";

export interface GetMediasParams {
  pageNumber: number;
  pageSize: number;
}

export const getMediasByFolder = async (
  folderId: string,
  params: GetMediasParams,
) => {
  try {
    const { data } = await apiClient.get<
      SuccessResponse<MediaResponsePageResult>
    >(`/medias/folder/${folderId}`, {
      params: params,
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const uploadMedia = async (folderId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<SuccessResponse<MediaResponse>>(
      "/medias/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        params: { folderId },
      },
    );

    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteMedia = async (mediaId: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/medias/${mediaId}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
