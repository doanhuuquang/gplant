"use client";

import User from "@/lib/models/user";
import { create } from "zustand";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { refresh } from "@/services/account-service";
import { me } from "@/services/user-service";

type AuthStoreState = {
  user: User | null;
  isLoading: boolean;
  authError: string | null;
  isLoggedIn: boolean;
};

type AuthStoreActions = {
  fetchMe: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>(
  (set) => ({
    user: null,
    isLoading: true,
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
        const userData = response.data as User;

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
  }),
);
