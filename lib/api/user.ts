import { apiClient } from "./client";
import { handleError } from "@/lib/helpers/error-handler";
import { SuccessResponse } from "@/types/api";
import {
  UpdateUserRequest,
  UserResponse,
  UserResponsePageResult,
} from "@/types/user";

export interface GetUsersParams {
  searchTerm?: string;
  role?: string;
  emailConfirmed?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export const getMe = async () => {
  try {
    const { data } =
      await apiClient.get<SuccessResponse<UserResponse>>("/users/me");
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateProfile = async (request: UpdateUserRequest) => {
  try {
    const { data } = await apiClient.put<SuccessResponse<UserResponse>>(
      "/users/me",
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getUsers = async (params: GetUsersParams = {}) => {
  const { pageNumber = 1, pageSize = 20, ...rest } = params;
  try {
    const { data } = await apiClient.get<
      SuccessResponse<UserResponsePageResult>
    >("/users", {
      params: { pageNumber, pageSize, ...rest },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const { data } = await apiClient.get<SuccessResponse<UserResponse>>(
      `/users/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateUser = async (id: string, request: UpdateUserRequest) => {
  try {
    const { data } = await apiClient.put<SuccessResponse<UserResponse>>(
      `/users/${id}`,
      request,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<null>>(
      `/users/${id}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const assignRole = async (userId: string, roleName: string) => {
  try {
    const { data } = await apiClient.post<SuccessResponse<UserResponse>>(
      `/users/${userId}/roles`,
      { roleName },
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const removeRole = async (userId: string, roleName: string) => {
  try {
    const { data } = await apiClient.delete<SuccessResponse<UserResponse>>(
      `/users/${userId}/roles/${roleName}`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const toggleLockUser = async (id: string) => {
  try {
    const { data } = await apiClient.patch<SuccessResponse<UserResponse>>(
      `/users/${id}/toggle-lock`,
    );
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
