import Image from "next/image";
import { APP_IMAGES } from "@/lib/constants/app-images";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/lib/enums/order-status";
import { PaymentMethod } from "@/lib/enums/payment-method";
import { PaymentStatus } from "@/lib/enums/payment-status";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface OrderPaymentMethodProps {
  paymentMethod: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  formattedExpiry: string;
  qrPayment?: string;
  vnpayUrl?: string;
  className?: string;
}

export function OrderPaymentMethod({
  paymentMethod,
  orderStatus,
  paymentStatus,
  formattedExpiry,
  qrPayment,
  vnpayUrl,
  className,
}: OrderPaymentMethodProps) {
  const router = useRouter();
  const isPendingPayment =
    paymentStatus === PaymentStatus.Pending ||
    paymentStatus === PaymentStatus.AwaitingPayment ||
    paymentStatus === PaymentStatus.Failed;
  const normalizedOrderStatus = String(orderStatus).toLowerCase();
  const isOrderClosed =
    orderStatus === OrderStatus.Cancelled ||
    orderStatus === OrderStatus.Refunded ||
    normalizedOrderStatus === "cancelled" ||
    normalizedOrderStatus === "refunded";
  const shouldShowPaymentActions = isPendingPayment && !isOrderClosed;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="w-full flex items-center justify-between">
        <p className="font-semibold">Phương thức thanh toán</p>
      </div>

      <p className="text-xs text-muted-foreground">
        {paymentMethod} | {paymentStatus}
      </p>

      {shouldShowPaymentActions && (
        <div className="w-full border rounded-sm">
          <div className="p-2 border-b bg-muted space-y-1">
            <p className="text-xs">
              Bạn vẫn chưa hoàn tất thanh toán cho đơn hàng này
            </p>
            <p className="text-muted-foreground text-xs">
              {`Vui lòng hoàn tất thanh toán trước ${formattedExpiry}. Các đơn chưa thanh toán sau thời gian này có thể bị hủy.`}
            </p>
          </div>

          {paymentMethod === PaymentMethod.BankTransfer && qrPayment && (
            <div className="w-full p-2">
              <Image
                src={qrPayment}
                alt="QR Payment"
                width={80}
                height={80}
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
                Thanh toán ngay
                <Image
                  src={APP_IMAGES.ICON_VNPAY}
                  alt="VNPay"
                  width={0}
                  height={0}
                  className="w-auto h-3"
                />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
