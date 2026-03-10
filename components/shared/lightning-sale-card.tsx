import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { APP_PATHS } from "@/lib/constants/app-paths";
import AddToCartRequest from "@/lib/schemas/cart/add-to-cart-request";
import { LightningSaleItemResponse } from "@/lib/schemas/lightning-sale/lightning-sale-item-response";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/utils/helpers";
import {
  ExternalLink,
  LoaderCircle,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LightningSaleCardProps {
  className?: string;
  lightningSaleItem: LightningSaleItemResponse;
}

export default function LightningSaleCard({
  className,
  lightningSaleItem,
}: LightningSaleCardProps) {
  const { handleAddToCart, isAddingToCart } = useAddToCart();
  const primaryImage: string = getFileUrl(
    lightningSaleItem.plant.images.find((img) => img.isPrimary)?.media?.fileUrl,
  );

  return (
    <div className="w-full">
      <div className={cn("group grid grid-cols-11 gap-4", className)}>
        <div className="relative col-span-5">
          <Link
            href={`${APP_PATHS.SHOP_PRODUCT}${lightningSaleItem.plant.slug}?sku=${lightningSaleItem.salePlantVariant?.sku}`}
          >
            <Image
              src={primaryImage}
              alt={lightningSaleItem.plant.name}
              width={100}
              height={100}
              unoptimized
              className="w-full rounded-sm"
            />
            <div className="w-fit bg-[#F7F70B] text-[#2A2A2A] text-xs font-medium px-2 py-1 absolute top-2 right-2 rounded-xs">{`${Math.round(lightningSaleItem.discountPercentage)}% OFF`}</div>
            <div className="w-full h-full bg-black/20 absolute top-0 left-0 rounded-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
              <ExternalLink className="text-white size-2 group-hover:size-7 transition-all" />
            </div>
          </Link>
        </div>

        <div className="col-span-6 flex flex-col gap-2 justify-between">
          <div>
            <p className="font-semibold text-muted-foreground">
              Lightning Sale
            </p>
            <p className="text-2xl font-semibold text-primary mb-1">{`${Math.round(lightningSaleItem.discountPercentage)}% OFF`}</p>
            <p className="font-medium">{lightningSaleItem.plant.name}</p>
            <p className="text-xs text-muted-foreground">
              {lightningSaleItem.salePlantVariant?.size} cm
            </p>
            <div className="flex items-baseline gap-2 my-2">
              <p className="text-xl font-semibold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(lightningSaleItem.salePrice)}
              </p>
              <p className="text-muted-foreground line-through">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(lightningSaleItem.originalPrice)}
              </p>
            </div>
          </div>
          <Button
            className="mt-auto uppercase"
            onClick={async () => {
              const request: AddToCartRequest = {
                plantVariantId: lightningSaleItem.salePlantVariant?.id ?? "",
                quantity: 1,
              };

              await handleAddToCart(request);
            }}
          >
            {isAddingToCart ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <ShoppingBag />
            )}
            Add To Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
