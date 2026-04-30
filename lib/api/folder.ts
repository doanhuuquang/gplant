import { apiClient } from "@/lib/api/client";
import { CreateFolderRequest, FolderResponse } from "@/types/folder";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";

export const getFolders = async () => {
  try {
    const { data } =
      await apiClient.get<SuccessResponse<FolderResponse[]>>("/folders");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createFolder = async (request: CreateFolderRequest) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<null>>(
      "/folders",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteFolder = async (id: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/folders/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
