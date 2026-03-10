"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const { user, isLoading, authError, isLoggedIn, fetchMe, refreshToken } =
    useAuthStore();

  useEffect(() => {
    if (user === null) {
      // Just fetch the user — the axios 401 interceptor will
      // automatically refresh the token if the access token expired.
      fetchMe();
    }
  }, [user, fetchMe]);

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
