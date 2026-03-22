import axiosInstance from "@/lib/helpers/axios-config";
import { handleError } from "@/lib/helpers/error-handler";
import { ApiSuccessResponse } from "@/lib/schemas/api/api-success-response";
import { UpdateUserRequest } from "@/lib/schemas/user/update-user-request";

const USERS_URL = "/api/users";

export interface GetUsersParams {
  searchTerm?: string;
  role?: string;
  emailConfirmed?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

const me = async (): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${USERS_URL}/me`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updateProfileApi = async (
  request: UpdateUserRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.put(`${USERS_URL}/me`, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getUsers = async (
  params: GetUsersParams = {},
): Promise<ApiSuccessResponse> => {
  const { pageNumber = 1, pageSize = 20, ...rest } = params;

  try {
    const response = await axiosInstance.get(USERS_URL, {
      params: { pageNumber, pageSize, ...rest },
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const getUserById = async (id: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.get(`${USERS_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const updateUserApi = async (
  id: string,
  request: UpdateUserRequest,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.put(`${USERS_URL}/${id}`, request);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const deleteUserApi = async (id: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(`${USERS_URL}/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const assignRoleApi = async (
  userId: string,
  roleName: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.post(`${USERS_URL}/${userId}/roles`, {
      roleName,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const removeRoleApi = async (
  userId: string,
  roleName: string,
): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.delete(
      `${USERS_URL}/${userId}/roles/${roleName}`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const toggleLockUserApi = async (id: string): Promise<ApiSuccessResponse> => {
  try {
    const response = await axiosInstance.patch(
      `${USERS_URL}/${id}/toggle-lock`,
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export {
  me,
  updateProfileApi,
  getUsers,
  getUserById,
  updateUserApi,
  deleteUserApi,
  assignRoleApi,
  removeRoleApi,
  toggleLockUserApi,
};
