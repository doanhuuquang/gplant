"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/user-store";

export function useGetUsers() {
  const {
    users,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    isLoading,
    userError,
    fetchUsers,
    setPageNumber,
    setPageSize,
  } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, pageNumber, pageSize]);

  return {
    users,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    isLoading,
    userError,
    setPageNumber,
    setPageSize,
  };
}
