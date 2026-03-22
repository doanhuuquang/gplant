"use client";

import UserResponse from "@/lib/schemas/user/user-response";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { create } from "zustand";
import { me, updateProfileApi } from "@/services/user-service";
import { refresh } from "@/services/account-service";
import { UpdateUserRequest } from "@/lib/schemas/user/update-user-request";

type AuthStoreState = {
  user: UserResponse | null;
  isLoading: boolean;
  isUpdatingProfile: boolean;
  authError: string | null;
  isLoggedIn: boolean;
};

type AuthStoreActions = {
  fetchMe: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (request: UpdateUserRequest) => Promise<void>;
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>(
  (set) => ({
    user: null,
    isLoading: true,
    isUpdatingProfile: false,
    authError: null,
    isLoggedIn: false,

    fetchMe: async () => {
      try {
        set({
          isLoading: true,
          authError: null,
          user: null,
          isLoggedIn: false,
        });

        const response = await me();
        const userData = response.data as UserResponse;

        set({
          user: userData,
          isLoggedIn: true,
          authError: null,
        });
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({
          authError: err.message,
          user: null,
          isLoggedIn: false,
        });
      } finally {
        set({ isLoading: false });
      }
    },

    refreshToken: async () => {
      try {
        set({ isLoading: true, authError: null });
        await refresh();
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ authError: err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    updateProfile: async (request: UpdateUserRequest) => {
      try {
        set({ isUpdatingProfile: true, authError: null });
        const response = await updateProfileApi(request);
        const userData = response.data as UserResponse;
        set({ user: userData, authError: null });
      } catch (e) {
        const err = e as ApiErrorResponse;
        set({ authError: err.message });
      } finally {
        set({ isUpdatingProfile: false });
      }
    },
  }),
);
