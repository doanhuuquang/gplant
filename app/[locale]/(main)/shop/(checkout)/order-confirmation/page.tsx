"use client";

import Image from "next/image";
import { APP_IMAGES } from "@/lib/constants/app-images";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice, getFileUrl } from "@/utils/helpers";
import { OrderResponse } from "@/lib/schemas/order/order-response";
import { PaymentMethod } from "@/lib/enums/payment-method";
import { PaymentStatus } from "@/lib/enums/payment-status";
import { useEffect } from "react";
import { useGetOrderByOrderNumber } from "@/hooks/order/use-get-order-by-order-number";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetQrPaymentByOrderId } from "@/hooks/order/use-get-qr-payment-by-order-id";

function CODNote() {
  return <div></div>;
}

function BankTransferNote({ order }: { order: OrderResponse }) {
  const { qrPayment } = useGetQrPaymentByOrderId(order.id);

  const formattedExpiry = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(order.createdAtUtc ?? ""));

  return (
    <div className="w-full border rounded-sm">
      <div className="p-4 border-b bg-muted space-y-1">
        <p className="text-lg font-semibold">
          You have not yet completed payment for this order
        </p>
        <p className="text-muted-foreground text-sm">
          {`Please ensure that payment for your order is completed by ${
            formattedExpiry
          }. Orders that remain unpaid after this time will be automatically cancelled.`}
        </p>
      </div>

      {qrPayment && (
        <div className="w-full p-4">
          <Image
            src={qrPayment}
            alt=""
            width={100}
            height={100}
            unoptimized
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}

function VNPayNote({ order }: { order: OrderResponse }) {
  const formattedExpiry = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(order.createdAtUtc ?? ""));

  return (
    <div className="w-full border rounded-sm">
      <div className="p-4 border-b bg-muted space-y-1">
        <p className="text-lg font-semibold">
          You have not yet completed payment for this order
        </p>
        <p className="text-muted-foreground text-sm">
          {`Please ensure that payment for your order is completed by ${
            formattedExpiry
          }. Orders that remain unpaid after this time will be automatically cancelled.`}
        </p>
      </div>

      <Button
        variant={"ghost"}
        className="w-full rounded-none uppercase font-semibold"
      >
        Pay now
        <Image
          src={APP_IMAGES.ICON_VNPAY}
          alt=""
          width={0}
          height={0}
          className="w-auto h-3"
        />
      </Button>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  const { orderByOrderNumber, isGettingOrderByOrderNumber } =
    useGetOrderByOrderNumber(orderNumber ?? "");

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
          Thankyou for your order !
        </p>

        {/*  */}
        <div className="w-full border rounded-sm space-y-5">
          <div className="w-full p-4 border-b bg-muted">
            <p className="text-lg font-semibold">
              Order number {orderByOrderNumber.orderNumber}
            </p>
          </div>

          {/*  */}
          <div className="w-full p-4 grid lg:grid-cols-5 grid-cols-1 gap-4">
            {/* Shipping Address */}
            <div className="space-y-3">
              <div className="w-full flex items-center justify-between">
                <p className="font-semibold">Shipping Address</p>
              </div>

              <p className="text-xs text-muted-foreground">
                {`${orderByOrderNumber} - 
                ${orderByOrderNumber.shippingPhone}`}
              </p>
              <p className="text-xs text-muted-foreground">{`${orderByOrderNumber.buildingName}, ${orderByOrderNumber.address}`}</p>
            </div>

            {/* Payment method */}
            <div className="space-y-3">
              <div className="w-full flex items-center justify-between">
                <p className="font-semibold">Payment method</p>
              </div>

              <p className="text-xs text-muted-foreground">
                {orderByOrderNumber.paymentMethod}
              </p>
            </div>

            {/* Order Status */}
            <div className="space-y-3">
              <div className="w-full flex items-center justify-between">
                <p className="font-semibold">Order Status</p>
              </div>

              <p className="text-xs text-muted-foreground">
                {orderByOrderNumber.status}
              </p>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-3">
              <p className="font-semibold">Order Summary</p>

              <div className="space-y-1">
                {/*  */}
                <div className="w-full flex items-center justify-between gap-4">
                  <p className="text-muted-foreground text-xs">Sub total</p>
                  <p className="text-muted-foreground text-xs font-semibold">
                    {formatPrice(orderByOrderNumber.subTotal ?? 0)}
                  </p>
                </div>
                {/*  */}
                <div className="w-full flex items-center justify-between gap-4">
                  <p className="text-muted-foreground text-xs">Discount</p>
                  <p className="text-muted-foreground text-xs font-semibold">
                    -{formatPrice(orderByOrderNumber.discountAmount ?? 0)}
                  </p>
                </div>
                {/*  */}
                <div className="w-full flex items-center justify-between gap-4">
                  <p className="text-muted-foreground text-xs">Shipping</p>
                  <p className="text-muted-foreground text-xs font-semibold">
                    {orderByOrderNumber.shippingFee > 0
                      ? formatPrice(orderByOrderNumber.shippingFee ?? 0)
                      : "Free"}
                  </p>
                </div>
                {/*  */}
                <div className="w-full h-[0.2px] bg-border my-4"></div>

                {/*  */}
                <div className="w-full flex items-center justify-between gap-4">
                  <div className="space-x-1">
                    <span className="text-lg font-semibold">TOTAL</span>
                    <span className="text-muted-foreground text-xs">
                      Inc.vat
                    </span>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatPrice(orderByOrderNumber?.total ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  */}
        <div>
          {orderByOrderNumber.items.map((item, index) => {
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

                  <p className="font-semibold text-sm">Qty {item.quantity}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right */}
      {orderByOrderNumber.paymentStatus !== PaymentStatus.Paid &&
        orderByOrderNumber.paymentStatus !== PaymentStatus.Refunded && (
          <div className="lg:col-span-2">
            {orderByOrderNumber.paymentMethod === PaymentMethod.COD ? (
              <CODNote />
            ) : orderByOrderNumber.paymentMethod ===
              PaymentMethod.BankTransfer ? (
              <BankTransferNote order={orderByOrderNumber} />
            ) : orderByOrderNumber.paymentMethod === PaymentMethod.VNPay ? (
              <VNPayNote order={orderByOrderNumber} />
            ) : null}
          </div>
        )}
    </main>
  );
}
