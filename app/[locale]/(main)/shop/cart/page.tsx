"use client";

import CartItemCart from "@/components/shared/cart-item-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useGetCart } from "@/hooks/cart/use-get-cart";
import { APP_IMAGES } from "@/lib/constants/app-images";
import { APP_PATHS } from "@/lib/constants/app-paths";
import Image from "next/image";
import Link from "next/link";

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

export default function CartPage() {
  const { cart, isLoadingCart } = useGetCart();

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
          </div>
        )}
      </div>
    </main>
  );
}
