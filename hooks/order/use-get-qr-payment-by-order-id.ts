import { useEffect, useState } from "react";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { GetQRPaymentByOrderId } from "@/services/order-service";

export function useGetQrPaymentByOrderId(orderId: string) {
  const [qrPayment, setQrPayment] = useState<string>("");
  const [isGettingQrPayment, setIsGettingQrPayment] = useState<boolean>(false);

  useEffect(() => {
    const handleGetQrPaymentByOrderId = async () => {
      try {
        setIsGettingQrPayment(true);

        const response = await GetQRPaymentByOrderId(orderId);
        setQrPayment(response.data);
      } catch (e) {
        const err = e as ApiErrorResponse;
      } finally {
        setIsGettingQrPayment(false);
      }
    };

    handleGetQrPaymentByOrderId();
  }, [orderId]);

  return { qrPayment, isGettingQrPayment };
}
