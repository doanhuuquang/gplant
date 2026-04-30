"use client";

import Image from "next/image";
import { APP_IMAGES } from "@/lib/constants/app-images";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice, getFileUrl } from "@/utils/helpers";
import { OrderResponse } from "@/types/order";
import { PaymentMethod } from "@/lib/enums/payment-method";
import { PaymentStatus } from "@/lib/enums/payment-status";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useOrderByOrderNumber,
  useQRPaymentByOrderId,
  useVNPayUrlByOrderId,
} from "@/lib/hooks/use-order";

function CODNote({ order }: { order: OrderResponse }) {
  return (
    <div className="w-full border rounded-sm">
      <div className="p-4 border-b bg-muted space-y-1">
        <p className="text-lg font-semibold">Thanh toán khi nhận hàng (COD)</p>
        <p className="text-muted-foreground text-sm">
          Đơn hàng của bạn đã được ghi nhận. Vui lòng chuẩn bị đúng số tiền khi
          nhận hàng để việc giao nhận diễn ra nhanh hơn.
        </p>
      </div>

      <div className="p-4 space-y-2 text-sm">
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground">Số tiền cần thanh toán</span>
          <span className="font-semibold">{formatPrice(order.total)}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground">Trạng thái thanh toán</span>
          <span className="font-semibold">{order.paymentStatusDisplay}</span>
        </div>
        <p className="text-muted-foreground text-xs pt-1">
          Nhân viên giao hàng sẽ liên hệ trước khi giao. Nếu cần đổi thời gian
          nhận hàng, bạn vui lòng chuẩn bị điện thoại để xác nhận.
        </p>
      </div>
    </div>
  );
}

function BankTransferNote({ order }: { order: OrderResponse }) {
  const { data: qrPayment, isLoading: isGettingQrPayment } =
    useQRPaymentByOrderId(order.id);

  const createdAt = new Date(order.createdAtUtc);
  createdAt.setDate(createdAt.getDate() + 1);
  const formattedExpiry = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(createdAt);

  return (
    <div className="w-full border rounded-sm">
      <div className="p-4 border-b bg-muted space-y-1">
        <p className="text-lg font-semibold">
          Chuyển khoản ngân hàng để hoàn tất đơn hàng
        </p>
        <p className="text-muted-foreground text-sm">
          {`Vui lòng hoàn tất thanh toán đơn hàng trước ${formattedExpiry}. Các đơn chưa thanh toán sau thời điểm này sẽ tự động bị hủy.`}
        </p>
      </div>

      <div className="p-4 space-y-2 text-sm border-b">
        <p className="font-medium">Hướng dẫn thanh toán:</p>
        <p className="text-muted-foreground">1. Quét mã QR bên dưới.</p>
        <p className="text-muted-foreground">
          2. Kiểm tra đúng số tiền {formatPrice(order.total)} trước khi xác nhận
          chuyển khoản.
        </p>
        <p className="text-muted-foreground">
          3. Nội dung chuyển khoản: {order.orderNumber}.
        </p>
      </div>

      {isGettingQrPayment ? (
        <div className="w-full p-4 text-sm text-muted-foreground">
          Đang tạo mã QR thanh toán...
        </div>
      ) : qrPayment?.data ? (
        <div className="w-full p-4">
          <Image
            src={qrPayment.data}
            alt="Mã QR thanh toán đơn hàng"
            width={100}
            height={100}
            unoptimized
            className="w-full"
          />
        </div>
      ) : (
        <div className="w-full p-4 text-sm text-destructive">
          Không tải được mã QR. Vui lòng thử lại sau ít phút.
        </div>
      )}
    </div>
  );
}

function VNPayNote({ order }: { order: OrderResponse }) {
  const router = useRouter();
  const createdAt = new Date(order.createdAtUtc);
  createdAt.setMinutes(createdAt.getMinutes() + 15);
  const formattedExpiry = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(createdAt);

  const { data: vnpayUrl, isLoading: isGettingVnpayUrl } = useVNPayUrlByOrderId(
    order.id,
  );

  return (
    <div className="w-full border rounded-sm">
      <div className="p-4 border-b bg-muted space-y-1">
        <p className="text-lg font-semibold">
          Thanh toán qua VNPay để hoàn tất đơn hàng
        </p>
        <p className="text-muted-foreground text-sm">
          {`Vui lòng hoàn tất thanh toán đơn hàng trước ${formattedExpiry}. Các đơn chưa thanh toán sau thời điểm này sẽ tự động bị hủy.`}
        </p>
      </div>

      <div className="p-4 border-b space-y-2 text-sm">
        <p className="text-muted-foreground">
          Nhấn nút bên dưới để chuyển đến cổng thanh toán VNPay.
        </p>
        <p className="text-muted-foreground">
          Số tiền cần thanh toán:{" "}
          <span className="font-semibold text-foreground">
            {formatPrice(order.total)}
          </span>
        </p>
      </div>

      <Button
        variant={"ghost"}
        className="w-full rounded-none uppercase font-semibold"
        onClick={() => router.push(vnpayUrl?.data ?? "")}
        disabled={isGettingVnpayUrl || !vnpayUrl?.data}
      >
        {isGettingVnpayUrl
          ? "Đang tạo liên kết thanh toán..."
          : "Thanh toán ngay"}
        <Image
          src={APP_IMAGES.ICON_VNPAY}
          alt="Biểu tượng VNPay"
          width={0}
          height={0}
          className="w-auto h-3"
        />
      </Button>
    </div>
  );
}

function VNPayPaidNote({ order }: { order: OrderResponse }) {
  return (
    <div className="w-full border rounded-sm">
      <div className="p-4 border-b bg-muted space-y-1">
        <p className="text-lg font-semibold">Thanh toán VNPay thành công</p>
        <p className="text-muted-foreground text-sm">
          Đơn hàng của bạn đã được thanh toán và ghi nhận thành công.
        </p>
      </div>

      <div className="p-4 space-y-2 text-sm">
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground">Mã đơn hàng</span>
          <span className="font-semibold">{order.orderNumber}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground">Tổng thanh toán</span>
          <span className="font-semibold">{formatPrice(order.total)}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground">Trạng thái thanh toán</span>
          <span className="font-semibold">{order.paymentStatusDisplay}</span>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  const { data: orderByOrderNumber, isLoading: isGettingOrderByOrderNumber } =
    useOrderByOrderNumber(orderNumber ?? "");

  useEffect(() => {
    if (
      !isGettingOrderByOrderNumber &&
      (orderByOrderNumber === null || orderNumber === null)
    ) {
      router.push(APP_PATHS.SHOP_SHIPPING);
    }
  }, [isGettingOrderByOrderNumber, orderByOrderNumber, orderNumber, router]);

  if (orderByOrderNumber === null) return null;

  return (
    <main className="w-full max-w-350 mx-auto px-4 grid lg:grid-cols-5 grid-cols-1 gap-10">
      {/* Left */}
      <div className="space-y-5 lg:col-span-3">
        <p className="text-2xl font-semibold uppercase">
          Cảm ơn bạn đã đặt hàng!
        </p>

        {/*  */}
        <div className="w-full border rounded-sm space-y-5">
          <div className="w-full p-4 border-b bg-muted">
            <p className="text-lg font-semibold">
              Mã đơn hàng {orderByOrderNumber?.data.orderNumber}
            </p>
          </div>

          {/*  */}
          <div className="w-full p-4 grid lg:grid-cols-5 grid-cols-1 gap-4">
            {/* Shipping Address */}
            <div className="space-y-3">
              <div className="w-full flex items-center justify-between">
                <p className="font-semibold">Địa chỉ giao hàng</p>
              </div>

              <p className="text-xs text-muted-foreground">
                {`${orderByOrderNumber?.data.shippingName} - 
                ${orderByOrderNumber?.data.shippingPhone}`}
              </p>
              <p className="text-xs text-muted-foreground">{`${orderByOrderNumber?.data.buildingName}, ${orderByOrderNumber?.data.address}`}</p>
            </div>

            {/* Payment method */}
            <div className="space-y-3">
              <div className="w-full flex items-center justify-between">
                <p className="font-semibold">Phương thức thanh toán</p>
              </div>

              <p className="text-xs text-muted-foreground">
                {orderByOrderNumber?.data.paymentMethod}
              </p>
            </div>

            {/* Order Status */}
            <div className="space-y-3">
              <div className="w-full flex items-center justify-between">
                <p className="font-semibold">Trạng thái đơn hàng</p>
              </div>

              <p className="text-xs text-muted-foreground">
                {orderByOrderNumber?.data.status}
              </p>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-3">
              <p className="font-semibold">Tóm tắt đơn hàng</p>

              <div className="space-y-1">
                {/*  */}
                <div className="w-full flex items-center justify-between gap-4">
                  <p className="text-muted-foreground text-xs">Tạm tính</p>
                  <p className="text-muted-foreground text-xs font-semibold">
                    {formatPrice(orderByOrderNumber?.data.subTotal ?? 0)}
                  </p>
                </div>
                {/*  */}
                <div className="w-full flex items-center justify-between gap-4">
                  <p className="text-muted-foreground text-xs">Giảm giá</p>
                  <p className="text-muted-foreground text-xs font-semibold">
                    -{formatPrice(orderByOrderNumber?.data.discountAmount ?? 0)}
                  </p>
                </div>
                {/*  */}
                <div className="w-full flex items-center justify-between gap-4">
                  <p className="text-muted-foreground text-xs">Phí giao hàng</p>
                  <p className="text-muted-foreground text-xs font-semibold">
                    {orderByOrderNumber?.data &&
                    orderByOrderNumber.data.shippingFee > 0
                      ? formatPrice(orderByOrderNumber?.data.shippingFee ?? 0)
                      : "Miễn phí"}
                  </p>
                </div>
                {/*  */}
                <div className="w-full h-[0.2px] bg-border my-4"></div>

                {/*  */}
                <div className="w-full flex items-center justify-between gap-4">
                  <div className="space-x-1">
                    <span className="text-lg font-semibold">TỔNG CỘNG</span>
                    <span className="text-muted-foreground text-xs">
                      Đã gồm VAT
                    </span>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatPrice(orderByOrderNumber?.data.total ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  */}
        <div>
          {orderByOrderNumber?.data.items.map((item, index) => {
            const primaryImage = item.plant.images.find((img) => img.isPrimary);

            return (
              <div
                key={item.id}
                className={cn(
                  "w-full py-4 flex gap-4",
                  index !== 0 && "border-t",
                )}
              >
                <Image
                  src={getFileUrl(primaryImage?.media?.fileUrl)}
                  alt={item.plant.name}
                  width={80}
                  height={80}
                  unoptimized
                  className="rounded-sm"
                />

                <div className="grow flex flex-col justify-between">
                  <div className="w-full flex lg:flex-row flex-col items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.plant.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.variantSize}cm / {item.plant.category.name}
                      </p>
                    </div>

                    <div className="space-x-2">
                      {item.wasOnSale && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.price)}
                        </span>
                      )}
                      <span className="text-lg font-semibold">
                        {formatPrice(item.finalPrice)}
                      </span>
                    </div>
                  </div>

                  <p className="font-semibold text-sm">SL {item.quantity}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right */}
      <div className="lg:col-span-2">
        {orderByOrderNumber?.data.paymentMethod === PaymentMethod.VNPay ? (
          orderByOrderNumber?.data.paymentStatus === PaymentStatus.Paid ? (
            <VNPayPaidNote order={orderByOrderNumber?.data} />
          ) : orderByOrderNumber?.data.paymentStatus !==
            PaymentStatus.Refunded ? (
            <VNPayNote order={orderByOrderNumber?.data} />
          ) : null
        ) : orderByOrderNumber?.data.paymentStatus !== PaymentStatus.Paid &&
          orderByOrderNumber?.data.paymentStatus !== PaymentStatus.Refunded ? (
          orderByOrderNumber?.data.paymentMethod === PaymentMethod.COD ? (
            <CODNote order={orderByOrderNumber?.data} />
          ) : orderByOrderNumber?.data.paymentMethod ===
            PaymentMethod.BankTransfer ? (
            <BankTransferNote order={orderByOrderNumber?.data} />
          ) : null
        ) : null}
      </div>
    </main>
  );
}
