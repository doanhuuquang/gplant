import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { getOrderByOrderNumberApi } from "@/services/order-service";
import { OrderResponse } from "@/lib/schemas/order/order-response";
import { useEffect, useState } from "react";

export function useGetOrderByOrderNumber(orderNumber: string) {
  const [orderByOrderNumber, setOrderByOrderNumber] =
    useState<OrderResponse | null>(null);
  const [isGettingOrderByOrderNumber, setIsGettingOrderByOrderNumber] =
    useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGetOrderByOrderNumber = async () => {
      try {
        if (!orderNumber) return;

        setIsGettingOrderByOrderNumber(true);

        const response = await getOrderByOrderNumberApi(orderNumber);
        setOrderByOrderNumber(response.data as OrderResponse);
      } catch (e) {
        const err = e as ApiErrorResponse;
        setError(err.message ?? "Failed to load order.");
      } finally {
        setIsGettingOrderByOrderNumber(false);
      }
    };

    handleGetOrderByOrderNumber();
  }, [orderNumber]);

  return { orderByOrderNumber, isGettingOrderByOrderNumber, error };
}
