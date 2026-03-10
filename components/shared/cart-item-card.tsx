import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetPlantByVariant } from "@/hooks/inventory/use-get-inventory-by-variant";
import CartItemResponse from "@/lib/schemas/cart/cart-item-response";
import { cn } from "@/lib/utils";
import { formatPrice, getFileUrl } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import z from "zod";

export default function CartItemCart({
  cartItem,
}: {
  cartItem: CartItemResponse;
}) {
  const { inventoryByVariant } = useGetPlantByVariant(cartItem.plantVariant.id);

  const imageSrc = cartItem.plant.images.find((image) => image.isPrimary)?.media
    ?.fileUrl;
  const quantitySchema = z.object({
    quantity: z
      .number()
      .int()
      .positive("Quantity must be greater than 0")
      .max(
        inventoryByVariant?.quantityAvailable ?? 0,
        `Maximum available quantity is ${inventoryByVariant?.quantityAvailable ?? 0}`,
      ),
  });

  type QuantityFormValues = z.infer<typeof quantitySchema>;

  const form = useForm<QuantityFormValues>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: cartItem.quantity,
    },
    mode: "all",
  });

  return (
    <main className="w-full border rounded-sm p-4 flex gap-4">
      <div>
        <Image
          src={getFileUrl(imageSrc)}
          alt={cartItem.plant.name}
          width={0}
          height={0}
          unoptimized
          className="w-20 rounded-sm"
        />
      </div>
      <div className="flex grow flex-wrap gap-4">
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
                Inc.vat
              </p>
            </div>
            {cartItem.isOnSale && cartItem.discountPercentage && (
              <div className="flex items-center gap-3">
                <p className="line-through text-muted-foreground font-light text-sm">
                  {formatPrice(cartItem.plantVariant.price)}
                </p>

                <Badge className="bg-[#F7F70B] text-[#2A2A2A] font-semibold text-[9px] py-0!">
                  {`${Math.round(cartItem.discountPercentage)}% OFF`}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="lg:w-fit w-full">
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
                  className="bg-soft-peach hover:bg-soft-peach/50 dark:bg-muted dark:hover:bg-muted/50 text-foreground rounded-full"
                  disabled={form.getValues("quantity") <= 1}
                  onClick={() => {
                    const current = form.getValues("quantity");
                    if (current > 1)
                      form.setValue("quantity", current - 1, {
                        shouldValidate: true,
                      });
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
                  className="bg-soft-peach hover:bg-soft-peach/50 dark:bg-muted dark:hover:bg-muted/50 text-foreground rounded-full"
                  disabled={
                    form.getValues("quantity") >=
                    (inventoryByVariant?.quantityAvailable ?? 0)
                  }
                  onClick={() => {
                    const current = form.getValues("quantity");
                    if (current < 99)
                      form.setValue("quantity", current + 1, {
                        shouldValidate: true,
                      });
                  }}
                >
                  <Plus />
                </Button>
              </form>

              {/* Remove button */}
              <Button
                variant="ghost"
                className="h-fit! w-fit! p-0! text-muted-foreground hover:bg-transparent"
              >
                <Trash2 />
                Remove
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </main>
  );
}
