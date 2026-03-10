"use client";

import * as React from "react";
import UserResponse from "@/lib/schemas/user/user-response";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { getUserById } from "@/services/user-service";

export function useGetUserById(id: string) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<UserResponse | null>(null);

  const fetchUser = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getUserById(id);
      setUser(response.data as UserResponse);
    } catch (e) {
      const err = e as ApiErrorResponse;
      setError(err.message ?? "Failed to load user.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
}
