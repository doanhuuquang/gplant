"use client";

import { create } from "zustand";
import {
  getUsers,
  updateUserApi,
  deleteUserApi,
  assignRoleApi,
  removeRoleApi,
  toggleLockUserApi,
  type GetUsersParams,
} from "@/services/user-service";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import UserResponse from "@/lib/schemas/user/user-response";
import UserResponsePageResult from "@/lib/schemas/user/user-response-page-result";
import { UpdateUserRequest } from "@/lib/schemas/user/update-user-request";

type UserState = {
  users: UserResponse[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isLoading: boolean;
  userError: string | null;
};

type UserActions = {
  reset: () => void;
  fetchUsers: (params?: GetUsersParams) => Promise<void>;
  setPageNumber: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;
  updateUser: (id: string, request: UpdateUserRequest) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  assignRole: (userId: string, roleName: string) => Promise<void>;
  removeRole: (userId: string, roleName: string) => Promise<void>;
  toggleLockUser: (id: string) => Promise<void>;
};

export const useUserStore = create<UserState & UserActions>((set, get) => ({
  users: [],
  pageNumber: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  isLoading: false,
  userError: null,

  reset: () =>
    set({
      users: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
      isLoading: false,
      userError: null,
    }),

  fetchUsers: async (params?: GetUsersParams) => {
    const { pageNumber, pageSize } = get();
    try {
      set({ isLoading: true, userError: null });
      const response = await getUsers({ pageNumber, pageSize, ...params });
      const data = response.data as UserResponsePageResult;
      set({
        users: data?.items ?? [],
        totalCount: data?.totalCount ?? 0,
        totalPages: data?.totalPages ?? 0,
        hasPreviousPage: data?.hasPreviousPage ?? false,
        hasNextPage: data?.hasNextPage ?? false,
        userError: null,
      });
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ userError: err.message, users: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  setPageNumber: (pageNumber: number) => {
    const { totalPages } = get();
    if (pageNumber < 1 || pageNumber > totalPages) return;
    set({ pageNumber });
  },

  setPageSize: (pageSize: number) => {
    set({ pageSize, pageNumber: 1 });
  },

  updateUser: async (id: string, request: UpdateUserRequest) => {
    try {
      set({ isLoading: true, userError: null });
      await updateUserApi(id, request);
      await get().fetchUsers();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ userError: err.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (id: string) => {
    try {
      set({ isLoading: true, userError: null });
      await deleteUserApi(id);
      await get().fetchUsers();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ userError: err.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  assignRole: async (userId: string, roleName: string) => {
    try {
      set({ isLoading: true, userError: null });
      await assignRoleApi(userId, roleName);
      await get().fetchUsers();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ userError: err.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  removeRole: async (userId: string, roleName: string) => {
    try {
      set({ isLoading: true, userError: null });
      await removeRoleApi(userId, roleName);
      await get().fetchUsers();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ userError: err.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleLockUser: async (id: string) => {
    try {
      set({ isLoading: true, userError: null });
      await toggleLockUserApi(id);
      await get().fetchUsers();
    } catch (e) {
      const err = e as ApiErrorResponse;
      set({ userError: err.message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },
}));
