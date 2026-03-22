import { useOrderStore } from "@/stores/order-store";
import { useEffect } from "react";

export function useGetMyOrders() {
  const {
    myOrders,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    isLoadingMyOrders,
    orderError,
    fetchMyOrders,
    setPageNumber,
    setPageSize,
  } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders, pageNumber, pageSize]);

  return {
    myOrders,
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    isLoadingMyOrders,
    orderError,
    setPageNumber,
    setPageSize,
  };
}
