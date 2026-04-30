import Image from "next/image";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CartItemResponse, UpdateCartItemRequest } from "@/types/cart";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { formatPrice, getFileUrl } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PlantImageResponse } from "@/types/plant";
import { UpdateCartItemRequestValidation } from "@/validations/cart";
import { useForm } from "react-hook-form";
import { useInventoryOfVariant } from "@/lib/hooks/use-inventory";
import { useRemoveCartItem, useUpdateCartItem } from "@/lib/hooks/use-cart";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CartItemCart({
  cartItem,
}: {
  cartItem: CartItemResponse;
}) {
  const { data: inventoryByVariant } = useInventoryOfVariant(
    cartItem.plantVariant.id,
  );
  const { mutate: updateCartItem, isPending: isUpdatingCartItem } =
    useUpdateCartItem();
  const { mutate: removeCartItem, isPending: isRemovingCartItem } =
    useRemoveCartItem();

  const imageSrc = cartItem.plant.images.find(
    (image: PlantImageResponse) => image.isPrimary,
  )?.media?.fileUrl;

  type QuantityFormValues = z.infer<
    ReturnType<typeof UpdateCartItemRequestValidation>
  >;

  const form = useForm<QuantityFormValues>({
    resolver: zodResolver(
      UpdateCartItemRequestValidation(
        inventoryByVariant?.data.quantityAvailable ?? 0,
      ),
    ),
    defaultValues: {
      quantity: cartItem.quantity,
    },
    mode: "all",
  });

  return (
    <main className="w-full border rounded-sm bg-background dark:bg-muted p-4 flex gap-4">
      <div className="w-full max-w-20">
        <Image
          src={getFileUrl(imageSrc)}
          alt={cartItem.plant.name}
          width={0}
          height={0}
          unoptimized
          className="w-full h-auto rounded-sm"
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="grow space-y-1">
          <div>
            <p className="font-semibold">{cartItem.plant.name}</p>
            <p className="text-xs text-muted-foreground">
              {cartItem.plant.shortDescription} / {cartItem.plantVariant.sku} /{" "}
              {cartItem.plantVariant.size}cm
            </p>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <p className="text-xl font-bold">
                {cartItem.isOnSale && cartItem.salePrice
                  ? formatPrice(cartItem.salePrice)
                  : formatPrice(cartItem.price)}
              </p>
              <p className="font-semibold text-muted-foreground text-sm">
                Đã gồm VAT
              </p>
            </div>

            {cartItem.isOnSale && cartItem.discountPercentage && (
              <div className="flex items-center gap-3">
                <p className="line-through text-muted-foreground font-light text-sm">
                  {formatPrice(cartItem.plantVariant.price)}
                </p>

                <Badge className="bg-[#F7F70B] text-[#2A2A2A] font-semibold text-[9px] py-0!">
                  {`GIẢM ${Math.round(cartItem.discountPercentage)}%`}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex items-center justify-between gap-4">
          {/* Quantity */}
          <Form {...form}>
            <div className="h-full flex lg:flex-col lg:items-end items-center justify-between gap-3">
              {/* Quantity buttons */}
              <form
                onSubmit={form.handleSubmit(() => {})}
                className="flex items-center gap-2"
              >
                <Button
                  size={"icon"}
                  variant={"outline"}
                  className="bg-soft-peach hover:bg-soft-peach/50 dark:bg-muted dark:hover:bg-muted/50 text-foreground rounded-full"
                  disabled={
                    form.getValues("quantity") <= 1 || isUpdatingCartItem
                  }
                  onClick={() => {
                    const current = form.getValues("quantity");
                    if (current > 1) {
                      form.setValue("quantity", current - 1, {
                        shouldValidate: true,
                      });
                      updateCartItem({
                        cartItemId: cartItem.id,
                        request: {
                          quantity: current - 1,
                        } as UpdateCartItemRequest,
                      });
                    }
                  }}
                >
                  <Minus />
                </Button>

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <Tooltip open={!!form.formState.errors.quantity}>
                        <TooltipTrigger asChild>
                          <Input
                            className="w-15 border-none text-center no-spinner shadow-none dark:bg-transparent"
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? 0 : Number(val));
                              if (!form.formState.errors.quantity) {
                                updateCartItem({
                                  cartItemId: cartItem.id,
                                  request: {
                                    quantity: Number(val),
                                  } as UpdateCartItemRequest,
                                });
                              }
                            }}
                            value={field.value}
                            type="number"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{form.formState.errors.quantity?.message}</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormItem>
                  )}
                />

                <Button
                  size={"icon"}
                  variant={"outline"}
                  className="bg-soft-peach hover:bg-soft-peach/50 dark:bg-muted dark:hover:bg-muted/50 text-foreground rounded-full"
                  disabled={
                    form.getValues("quantity") >=
                      (inventoryByVariant?.data?.quantityAvailable ?? 0) ||
                    isUpdatingCartItem
                  }
                  onClick={() => {
                    const current = form.getValues("quantity");
                    if (current < 99) {
                      form.setValue("quantity", current + 1, {
                        shouldValidate: true,
                      });

                      updateCartItem({
                        cartItemId: cartItem.id,
                        request: {
                          quantity: current + 1,
                        } as UpdateCartItemRequest,
                      });
                    }
                  }}
                >
                  <Plus />
                </Button>
              </form>
            </div>
          </Form>

          {/* Remove button */}
          <Button
            variant="ghost"
            className="h-fit! w-fit! p-0! text-muted-foreground hover:bg-transparent"
            disabled={isRemovingCartItem}
            onClick={() => removeCartItem(cartItem.id)}
          >
            <Trash2 />
            Xóa
          </Button>
        </div>
      </div>
    </main>
  );
}
