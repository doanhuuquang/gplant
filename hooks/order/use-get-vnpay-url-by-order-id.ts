import { useEffect, useState } from "react";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { GetVNPayUrlByOrderId } from "@/services/order-service";

export function useGetVNPayUrlByOrderId(orderId: string) {
  const [vnpayUrl, setVnpayUrl] = useState<string>("");
  const [isGettingVnpayUrl, setIsGettingVnpayUrl] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGetQrPaymentByOrderId = async () => {
      try {
        setIsGettingVnpayUrl(true);

        const response = await GetVNPayUrlByOrderId(orderId);
        setVnpayUrl(response.data);
      } catch (e) {
        const err = e as ApiErrorResponse;
        setError(err.message ?? "Failed to load VNPay URL.");
      } finally {
        setIsGettingVnpayUrl(false);
      }
    };

    handleGetQrPaymentByOrderId();
  }, [orderId]);

  return { vnpayUrl, isGettingVnpayUrl, error };
}
