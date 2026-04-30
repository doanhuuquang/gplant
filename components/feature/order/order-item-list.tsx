import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice, getFileUrl } from "@/utils/helpers";
import { OrderResponse } from "@/types/order";

interface OrderItemListProps {
  items: OrderResponse["items"];
}

export function OrderItemList({ items }: OrderItemListProps) {
  return (
    <div className="p-4">
      {items.map((item, index) => {
        const primaryImage = item.plant.images.find((img) => img.isPrimary);

        return (
          <div
            key={item.id}
            className={cn("w-full py-4 flex gap-4", index !== 0 && "border-t")}
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
  );
}
