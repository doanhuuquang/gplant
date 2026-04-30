"use client";

import Image from "next/image";
import Link from "next/link";
import { APP_IMAGES } from "@/lib/constants/app-images";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CartItemResponse } from "@/types/cart";
import { Check, LoaderCircle, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateOrderRequest } from "@/types/order";
import { formatPrice, getFileUrl } from "@/utils/helpers";
import { PaymentMethod } from "@/lib/enums/payment-method";
import { ShippingAddressResponse } from "@/types/shipping-address";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCart } from "@/lib/hooks/use-cart";
import { useEffect, useState } from "react";
import { usePlaceOrder } from "@/lib/hooks/use-order";
import { useRouter, useSearchParams } from "next/navigation";
import { useShippingAddresses } from "@/lib/hooks/use-shipping-address";
import { PlantImageResponse } from "@/types/plant";

interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  icon: string;
}

const paymentMethodOptions: PaymentMethodOption[] = [
  {
    value: PaymentMethod.COD,
    label: "Thanh toán tiền mặt/thẻ khi nhận hàng",
    icon: APP_IMAGES.ICON_CASH,
  },
  {
    value: PaymentMethod.BankTransfer,
    label: "Chuyển khoản ngân hàng",
    icon: APP_IMAGES.ICON_VISA,
  },
  {
    value: PaymentMethod.VNPay,
    label: "Thanh toán qua VNPay",
    icon: APP_IMAGES.ICON_VNPAY,
  },
];

function CheckoutProductCard({ cartItem }: { cartItem: CartItemResponse }) {
  const primaryImage = cartItem.plant.images.find(
    (image: PlantImageResponse) => image.isPrimary,
  );

  return (
    <div className="w-full border rounded-sm p-4 flex gap-4">
      <Image
        src={getFileUrl(primaryImage?.media?.fileUrl)}
        alt={cartItem.plant.name}
        width={80}
        height={80}
        unoptimized
        className="rounded-sm"
      />

      <div className="grow flex flex-col justify-between">
        <div className="w-full flex lg:flex-row flex-col items-start justify-between gap-4">
          <div>
            <p className="font-semibold">
              {cartItem.plant.name}
              {cartItem.discountPercentage && (
                <Badge className="bg-[#F7F70B] text-[#2A2A2A] font-semibold text-[9px] ml-2">
                  {`GIẢM ${Math.round(cartItem.discountPercentage)}%`}
                </Badge>
              )}
            </p>
            <p className="text-muted-foreground text-sm">
              {cartItem.plantVariant.size}cm / {cartItem.plant.category.name}
            </p>
          </div>

          <div className="space-x-2">
            {cartItem.isOnSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(cartItem.price)}
              </span>
            )}
            <span className="text-lg font-semibold">
              {formatPrice(cartItem.finalPrice)}
            </span>
          </div>
        </div>

        <p className="font-semibold text-sm">SL {cartItem.quantity}</p>
      </div>
    </div>
  );
}

export default function Page() {
  const searchParams = useSearchParams();
  const shippingAddressId = searchParams.get("shipping-address-id");
  const router = useRouter();

  const [note, setNote] = useState<string>("");
  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<ShippingAddressResponse | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(PaymentMethod.COD);

  const { user } = useAuthStore();
  const { data: cart, isLoading: isLoadingCart } = useCart();
  const { mutate: placeOrder, isPending: isPlacingOrder } = usePlaceOrder();
  const { data: shippingAddresses } = useShippingAddresses(user?.id ?? "");

  useEffect(() => {
    const setAddress = () => {
      if (!shippingAddressId) return;

      const address = shippingAddresses?.data.find(
        (address) => address.id === shippingAddressId,
      );
      setSelectedShippingAddress?.(address ?? null);
    };

    setAddress();
  }, [shippingAddresses, shippingAddressId]);

  useEffect(() => {
    const setDefaultPaymentMethod = () => {
      setSelectedPaymentMethod?.(PaymentMethod.COD);
    };

    setDefaultPaymentMethod();
  }, [setSelectedPaymentMethod]);

  useEffect(() => {
    if (shippingAddressId === "") router.push(APP_PATHS.SHOP_SHIPPING);
  }, [shippingAddressId, router]);

  useEffect(() => {
    if (!isLoadingCart && (!cart || cart.data.items.length === 0))
      router.push(APP_PATHS.SHOP_SHIPPING);
  }, [isLoadingCart, cart, router]);

  return (
    <main className="w-full max-w-350 mx-auto px-4 space-y-5">
      <p className="text-xl font-semibold">Chọn phương thức thanh toán</p>

      <div className="w-full grid grid-cols-3 gap-10">
        {/* Left */}
        <div className="lg:col-span-2 col-span-3 space-y-10">
          <div className="space-y-4">
            {paymentMethodOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "w-full rounded-sm p-4 border cursor-pointer flex items-center gap-4",
                  option.value === selectedPaymentMethod && "border-foreground",
                )}
                onClick={() => setSelectedPaymentMethod?.(option.value)}
              >
                <Check
                  className={cn(
                    option.value === selectedPaymentMethod
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                />
                <p
                  className={cn(
                    option.value === selectedPaymentMethod
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {option.label}
                </p>
                <div className="ml-auto p-1 border bg-white">
                  <Image
                    src={option.icon}
                    alt=""
                    width={0}
                    height={0}
                    className="w-auto h-3"
                  />
                </div>
              </div>
            ))}
          </div>

          <Textarea
            placeholder="Ghi chú cho Gplant"
            className="rounded-sm p-4"
            onChange={(e) => setNote(e.target.value)}
          />

          <Button
            className="w-full"
            disabled={isPlacingOrder}
            onClick={() => {
              const request: CreateOrderRequest = {
                shippingName: selectedShippingAddress?.shippingName ?? "",
                shippingPhone: selectedShippingAddress?.shippingPhone ?? "",
                buildingName: selectedShippingAddress?.buildingName ?? "",
                address: selectedShippingAddress?.address ?? "",
                longitude: selectedShippingAddress?.longitude ?? "",
                latitude: selectedShippingAddress?.latitude ?? "",
                paymentMethod: selectedPaymentMethod,
                shippingNote: note,
              };

              placeOrder(request);
            }}
          >
            {`Tiếp tục với ${
              paymentMethodOptions.find(
                (pm) => pm.value === selectedPaymentMethod,
              )?.label ?? paymentMethodOptions[0].label
            }`}
            {isPlacingOrder ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <MoveRight />
            )}
          </Button>

          <div className="space-y-4">
            <p className="text-lg font-semibold">Đơn hàng của bạn</p>
            {cart?.data.items.map((item) => (
              <CheckoutProductCard key={item.id} cartItem={item} />
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:col-span-1 col-span-3">
          <div className="w-full border rounded-sm p-4 space-y-2">
            <p className="text-lg font-semibold">TÓM TẮT ĐƠN HÀNG</p>
            {/*  */}
            <div className="w-full flex items-center justify-between gap-4">
              <p className="text-muted-foreground text-sm">Tạm tính</p>
              <p className="text-muted-foreground text-sm font-semibold">
                {formatPrice(cart?.data.subTotal ?? 0)}
              </p>
            </div>
            {/*  */}
            <div className="w-full flex items-center justify-between gap-4">
              <p className="text-muted-foreground text-sm">Giảm giá</p>
              <p className="text-muted-foreground text-sm font-semibold">
                -{formatPrice(cart?.data.totalDiscount ?? 0)}
              </p>
            </div>
            {/*  */}
            <div className="w-full flex items-center justify-between gap-4">
              <p className="text-muted-foreground text-sm">Phí giao hàng</p>
              <p className="text-muted-foreground text-sm font-semibold">
                {cart?.data.shippingCost && cart?.data.shippingCost > 0
                  ? formatPrice(cart?.data.shippingCost ?? 0)
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
              <p className="text-muted-foreground text-sm font-semibold">
                {formatPrice(cart?.data.total ?? 0)}
              </p>
            </div>

            {/*  */}
            <div className="w-full h-[0.2px] bg-border my-4"></div>

            {/*  */}
            <div className="space-y-3">
              <div className="w-full flex items-center justify-between">
                <p className="font-semibold">Giao đến</p>
                <Link
                  href={APP_PATHS.SHOP_SHIPPING}
                  className="text-sm text-muted-foreground"
                >
                  Chỉnh sửa
                </Link>
              </div>

              <p className="text-sm">
                {`${selectedShippingAddress?.shippingName} - 
                ${selectedShippingAddress?.shippingPhone}`}
              </p>
              <p className="text-sm">{`${selectedShippingAddress?.buildingName}, ${selectedShippingAddress?.address}`}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
