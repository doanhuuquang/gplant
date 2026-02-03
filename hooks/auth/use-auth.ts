"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const { user, isLoading, authError, isLoggedIn, fetchMe, refreshToken } =
    useAuthStore();

  useEffect(() => {
    if (user === null) {
      const initAuth = async () => {
        await refreshToken();
        await fetchMe();
      };
      initAuth();
    }
  }, [user, fetchMe, refreshToken]);

  return {
    user,
    isLoggedIn,
    isLoading,
    authError,
    refresh: async () => {
      await refreshToken();
      await fetchMe();
    },
  };
}
