"use client";

import CartItemCart from "@/components/shared/cart-item-card";
import Image from "next/image";
import Link from "next/link";
import { APP_IMAGES } from "@/lib/constants/app-images";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/helpers";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useGetCart } from "@/hooks/cart/use-get-cart";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function BreadcrumbCartPage() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={APP_PATHS.HOME}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>My cart</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function CartEmpty() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10">
      <Image
        src={APP_IMAGES.CART_EMPTY}
        alt=""
        width={0}
        height={0}
        className="w-full max-w-md"
      />
      <div className="text-center">
        <p className="text-lg font-semibold">Your room looks empty and blue</p>
        <p className="text-sm text-muted-foreground">
          Lets add some plants and make it live.
        </p>
      </div>

      <Link href={APP_PATHS.HOME}>
        <Button>Continue Shopping</Button>
      </Link>
    </div>
  );
}

function CartLoading() {
  return (
    <main className="w-full min-h-[70vh] space-y-4">
      <div className="w-full max-w-350 mx-auto px-4 py-10 space-y-10">
        <div className="w-full grid grid-cols-3 gap-10">
          <div className="space-y-4 lg:col-span-2 col-span-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-25 rounded-sm"
              ></Skeleton>
            ))}
          </div>
          <div className="space-y-4 lg:col-span-1 col-span-3">
            <Skeleton className="w-full h-100 rounded-sm"></Skeleton>
          </div>
        </div>
      </div>
    </main>
  );
}

function FreeShippingNotice({ total }: { total: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (total >= 500000) {
        setProgress(100);
      } else {
        setProgress((total / 500000) * 100);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [total]);

  return (
    <div className="w-full p-4 rounded-sm border space-y-4 bg-background dark:bg-muted">
      <p className="font-semibold">
        {total >= 500000
          ? "Congrats! You've earned FREE shipping!"
          : `You are ${formatPrice(500000 - total)} away from free shipping`}
      </p>
      <div className="space-y-1">
        <div className="w-full flex items-baseline justify-between text-sm text-muted-foreground">
          <p>{formatPrice(total)}</p>
          <p>{formatPrice(500000)}</p>
        </div>

        <Progress value={progress} className="w-full h-2.5" />
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, isLoadingCart } = useGetCart();

  if (isLoadingCart) return <CartLoading />;

  return (
    <main className="w-full min-h-[70vh] space-y-4">
      <div className="w-full max-w-350 mx-auto px-4 py-10 space-y-10">
        {!isLoadingCart && cart?.items.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="w-full grid grid-cols-3 gap-10">
            <div className="space-y-4 lg:col-span-2 col-span-3">
              <div className="space-y-1">
                <p className="text-xl font-bold">My cart</p>
                <BreadcrumbCartPage />
              </div>
              {cart?.items.map((item) => (
                <CartItemCart key={item.id} cartItem={item} />
              ))}
            </div>

            <div className="space-y-4 lg:col-span-1 col-span-3">
              <FreeShippingNotice total={cart?.total ?? 0} />

              {/* Order summary */}
              <div className="w-full p-4 rounded-sm border space-y-4 bg-background dark:bg-muted">
                <p className="font-semibold">Order Summary</p>
                <div className="space-y-1">
                  <div className="w-full flex items-baseline justify-between gap-4">
                    <p className="text-muted-foreground text-sm">Sub total</p>
                    <p className="font-medium text-sm">
                      {formatPrice(cart?.subTotal ?? 0)}
                    </p>
                  </div>
                  <div className="w-full flex items-baseline justify-between gap-4">
                    <p className="text-muted-foreground text-sm">Discount</p>
                    <p className="font-medium text-sm">
                      -{formatPrice(cart?.totalDiscount ?? 0)}
                    </p>
                  </div>
                  <div className="w-full flex items-baseline justify-between gap-4">
                    <p className="text-muted-foreground text-sm">Shipping</p>
                    <p className="font-medium text-sm">
                      {cart?.shippingCost && cart?.shippingCost > 0
                        ? formatPrice(cart?.shippingCost ?? 0)
                        : "Free"}
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-muted" />

                <div className="w-full flex items-baseline justify-between gap-4">
                  <div className="space-x-1">
                    <span className="text-lg font-semibold">TOTAL</span>
                    <span className="text-muted-foreground text-xs">
                      Inc.vat
                    </span>
                  </div>
                  <p className="font-semibold text-lg">
                    {formatPrice(cart?.total ?? 0)}
                  </p>
                </div>
              </div>

              <Link href={APP_PATHS.SHOP_SHIPPING}>
                <Button className="w-full flex items-center justify-between font-semibold">
                  <p>{formatPrice(cart?.total ?? 0)}</p>
                  <p className="leading-0">CHECKOUT NOW</p>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
