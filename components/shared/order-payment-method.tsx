import { PaymentMethod } from "@/lib/enums/payment-method";
import { PaymentStatus } from "@/lib/enums/payment-status";
import { Button } from "@/components/ui/button";
import { APP_IMAGES } from "@/lib/constants/app-images";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OrderPaymentMethodProps {
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  formattedExpiry: string;
  qrPayment?: string;
  vnpayUrl?: string;
}

export function OrderPaymentMethod({
  paymentMethod,
  paymentStatus,
  formattedExpiry,
  qrPayment,
  vnpayUrl,
}: OrderPaymentMethodProps) {
  const router = useRouter();
  const isPending =
    paymentStatus === PaymentStatus.AwaitingPayment ||
    paymentStatus === PaymentStatus.Pending;

  return (
    <div className="space-y-3">
      <div className="w-full flex items-center justify-between">
        <p className="font-semibold">Payment method</p>
      </div>

      <p className="text-xs text-muted-foreground">{paymentMethod}</p>

      {isPending && (
        <div className="w-full border rounded-sm">
          <div className="p-2 border-b bg-muted space-y-1">
            <p className="text-xs">
              You have not yet completed payment for this order
            </p>
            <p className="text-muted-foreground text-xs">
              {`Please ensure payment is completed by ${formattedExpiry}. Orders unpaid after this time may be cancelled.`}
            </p>
          </div>

          {paymentMethod === PaymentMethod.BankTransfer && qrPayment && (
            <div className="w-full p-2">
              <Image
                src={qrPayment}
                alt="QR Payment"
                width={100}
                height={100}
                unoptimized
                className="w-full"
              />
            </div>
          )}

          {paymentMethod === PaymentMethod.VNPay && vnpayUrl && (
            <div className="w-full">
              <Button
                variant={"ghost"}
                className="w-full rounded-none uppercase font-semibold"
                onClick={() => router.push(vnpayUrl)}
              >
                Pay now
                <Image
                  src={APP_IMAGES.ICON_VNPAY}
                  alt="VNPay"
                  width={0}
                  height={0}
                  className="w-auto h-3 ml-2"
                />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
