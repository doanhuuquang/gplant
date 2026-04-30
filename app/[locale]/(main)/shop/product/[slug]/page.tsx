"use client";

import Image from "next/image";
import Link from "next/link";
import WateringIcon from "@/components/common/watering-icon";
import z from "zod";
import { AddItemToCartRequest } from "@/types/cart";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { formatPrice, getFileUrl } from "@/utils/helpers";
import { Gem, LoaderCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InventoryResponse } from "@/types/inventory";
import { LightIcon } from "@/components/common/light-icon";
import { PlantResponse } from "@/types/plant";
import { SoilIcon } from "@/components/common/soil-icon";
import { TemperatureIcon } from "@/components/common/temperature-icon";
import { useAddItemToCart } from "@/lib/hooks/use-cart";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useInventoryOfVariant } from "@/lib/hooks/use-inventory";
import { useLightningSaleItemByPlantVariantId } from "@/lib/hooks/use-lightning-sale";
import { useParams, useSearchParams } from "next/navigation";
import { usePlantBySlug } from "@/lib/hooks/use-plant";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function BreadcrumbProductPage({ plant }: { plant?: PlantResponse | null }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={APP_PATHS.HOME}>Trang chủ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`${APP_PATHS.SHOP_CATEGORY}${plant?.category.slug}`}>
              {plant?.category.name}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{plant?.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function ProductImages({
  plant,
  className,
}: {
  plant?: PlantResponse | null;
  className?: string;
}) {
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const setDefaultImage = () => {
      setSelectedImage(
        plant?.images.find((image) => image.isPrimary)?.media?.fileUrl || "",
      );
    };

    setDefaultImage();
  }, [plant?.images]);

  return (
    <main
      className={cn(
        "w-full flex lg:flex-col flex-row-reverse gap-2",
        className,
      )}
    >
      {selectedImage && (
        <div>
          <Image
            src={getFileUrl(selectedImage)}
            alt={plant?.name || "Ảnh sản phẩm"}
            width={0}
            height={0}
            unoptimized
            className="w-full rounded-sm grow"
          />
        </div>
      )}

      <div className="w-fit min-w-20 flex lg:flex-row flex-col justify-start gap-2">
        {plant?.images.map((image) => (
          <div key={image.id} className="w-fit h-fit">
            <Image
              src={getFileUrl(image.media?.fileUrl)}
              alt={plant.name}
              width={0}
              height={0}
              unoptimized
              className="w-20 rounded-sm"
              onClick={() => setSelectedImage(image.media?.fileUrl || "")}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

function ProductCareInstruction({ plant }: { plant?: PlantResponse | null }) {
  return (
    <main className="border rounded-sm p-4 space-y-5">
      <p className="text-xl font-semibold">Chăm sóc cây</p>
      {/* Watering */}
      <div className="flex gap-4">
        <div className="shrink-0">
          <WateringIcon />
        </div>
        <div>
          <p className="font-medium">Tưới nước</p>
          <p className="text-muted-foreground text-sm">
            {plant?.careInstruction?.wateringFrequency}
          </p>
        </div>
      </div>
      {/* Light */}
      <div className="flex gap-4">
        <div className="shrink-0">
          <LightIcon />
        </div>
        <div>
          <p className="font-medium">Ánh sáng</p>
          <p className="text-muted-foreground text-sm">
            {plant?.careInstruction?.lightRequirement}
          </p>
        </div>
      </div>
      {/* Temperature */}
      <div className="flex gap-4">
        <div className="shrink-0">
          <TemperatureIcon />
        </div>

        <div>
          <p className="font-medium">Nhiệt độ</p>
          <p className="text-muted-foreground text-sm">
            {plant?.careInstruction?.temperature}
          </p>
        </div>
      </div>
      {/* Soil */}
      <div className="flex gap-4">
        <div className="shrink-0">
          <SoilIcon />
        </div>
        <div>
          <p className="font-medium">Đất trồng</p>
          <p className="text-muted-foreground text-sm">
            {plant?.careInstruction?.soil}
          </p>
        </div>
      </div>
    </main>
  );
}

function VariantStatus({
  plant,
  selectedPlantVariantId,
  inventoryByVariant,
}: {
  plant?: PlantResponse | null;
  selectedPlantVariantId?: string | null;
  inventoryByVariant?: InventoryResponse | null;
}) {
  const variant = plant?.variants.find((v) => v.id === selectedPlantVariantId);

  if (variant?.isActive === false) {
    return (
      <Badge className="bg-destructive text-white font-semibold">
        Ngừng kinh doanh
      </Badge>
    );
  } else if (!inventoryByVariant || inventoryByVariant?.isOutOfStock) {
    return (
      <Badge className="bg-destructive text-white font-semibold">
        Hết hàng
      </Badge>
    );
  } else if (inventoryByVariant?.isLowStock) {
    return (
      <Badge className="bg-[#F7F70B] text-[#2A2A2A] font-semibold">
        SẮP HẾT HÀNG
      </Badge>
    );
  }
  return null;
}

function ProductDetails({
  plant,
  sku,
}: {
  plant?: PlantResponse | null;
  sku?: string | null;
}) {
  const [selectedPlantVariantId, setSelectedPlantVariantId] =
    useState<string>("");

  const { data: lightningSaleItemByVariant } =
    useLightningSaleItemByPlantVariantId(selectedPlantVariantId);
  const { data: inventoryByVariant } = useInventoryOfVariant(
    selectedPlantVariantId,
  );
  const { mutate: addItemToCart, isPending: isAddingToCart } =
    useAddItemToCart();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (sku) {
        const variant = plant?.variants.find((variant) => variant.sku === sku);
        if (variant) setSelectedPlantVariantId(variant.id);
      } else {
        setSelectedPlantVariantId(plant?.variants[0].id || "");
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [sku, plant]);

  const quantitySchema = z.object({
    quantity: z
      .number()
      .int()
      .positive("Số lượng phải lớn hơn 0")
      .max(
        inventoryByVariant?.data.quantityAvailable ?? 0,
        `Số lượng tối đa có thể mua là ${inventoryByVariant?.data.quantityAvailable ?? 0}`,
      ),
  });

  type QuantityFormValues = z.infer<typeof quantitySchema>;

  const form = useForm<QuantityFormValues>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: 1,
    },
    mode: "all",
  });

  return (
    <Form {...form}>
      <main className="space-y-10">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            {/* Name, Short Description */}
            <div>
              <p className="text-xl font-semibold">{plant?.name}</p>
              <p className="text-muted-foreground text-sm">
                {plant?.shortDescription}
              </p>
            </div>

            {/* SKU */}
            <div className="flex items-center gap-3">
              <p className="text-muted-foreground text-sm">
                {
                  plant?.variants.find(
                    (variant) => variant.id === selectedPlantVariantId,
                  )?.sku
                }
              </p>

              <VariantStatus
                plant={plant}
                selectedPlantVariantId={selectedPlantVariantId}
                inventoryByVariant={inventoryByVariant?.data}
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold">
                  {lightningSaleItemByVariant?.data &&
                  lightningSaleItemByVariant.data.salePrice != null
                    ? formatPrice(lightningSaleItemByVariant.data.salePrice)
                    : formatPrice(
                        plant?.variants.find(
                          (variant) => variant.id === selectedPlantVariantId,
                        )?.price as number,
                      )}
                </p>
                <p className="font-semibold text-muted-foreground">
                  Đã gồm VAT
                </p>
              </div>
              {lightningSaleItemByVariant?.data &&
                lightningSaleItemByVariant.data.salePrice != null && (
                  <div className="flex items-center gap-3">
                    <p className="line-through text-muted-foreground font-light">
                      {formatPrice(
                        plant?.variants.find(
                          (variant) => variant.id === selectedPlantVariantId,
                        )?.price as number,
                      )}
                    </p>

                    <Badge className="bg-[#F7F70B] text-[#2A2A2A] font-semibold">
                      {`GIẢM ${Math.round(lightningSaleItemByVariant.data.discountPercentage ?? 0)}%`}
                    </Badge>
                  </div>
                )}
            </div>

            {/* Choose Variant */}
            <div className="space-y-2">
              <p className="text-muted-foreground font-semibold">
                Chọn chiều cao
              </p>
              <div className="flex items-center gap-3">
                {plant?.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={"outline"}
                    size={"default"}
                    disabled={
                      !variant.id || variant.id === selectedPlantVariantId
                    }
                    onClick={() => setSelectedPlantVariantId(variant.id)}
                  >
                    {variant.size}cm
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div
              className={cn(
                "space-y-2 relative transition-all",
                form.formState.errors.quantity && "pb-10 transition-all",
              )}
            >
              <p className="text-muted-foreground font-semibold">Số lượng</p>
              <div className="flex items-center gap-3">
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
                        <Input
                          className="w-20 border-none text-center no-spinner shadow-none dark:bg-transparent"
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? 0 : Number(val));
                          }}
                          value={field.value}
                          type="number"
                        />
                        <FormMessage className="absolute bottom-0 left-0" />
                      </FormItem>
                    )}
                  />

                  <Button
                    size={"icon"}
                    className="bg-soft-peach hover:bg-soft-peach/50 dark:bg-muted dark:hover:bg-muted/50 text-foreground rounded-full"
                    disabled={
                      form.getValues("quantity") >=
                      (inventoryByVariant?.data.quantityAvailable ?? 0)
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
              </div>
            </div>

            {/* Buttons */}
            <div className="w-full lg:static sticky bottom-4 flex gap-4">
              {/* Add to cart button */}
              <Button
                className="grow"
                disabled={
                  !!form.formState.errors.quantity ||
                  isAddingToCart ||
                  !inventoryByVariant ||
                  inventoryByVariant.data.quantityAvailable <= 0 ||
                  plant?.variants.find(
                    (variant) => variant.id === selectedPlantVariantId,
                  )?.isActive === false
                }
                onClick={async () => {
                  const request: AddItemToCartRequest = {
                    plantVariantId: selectedPlantVariantId,
                    quantity: form.getValues("quantity"),
                  };

                  addItemToCart(request);
                }}
              >
                {isAddingToCart ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <ShoppingBag />
                )}
                Thêm vào giỏ hàng
              </Button>

              {/* Add to wish list button */}
              <Button variant={"secondary"} className="grow">
                <Gem />
                Thêm vào yêu thích
              </Button>
            </div>
          </div>
          <ProductCareInstruction plant={plant} />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Thông tin cây</p>
          <p className="text-sm text-justify">{plant?.description}</p>
        </div>
      </main>
    </Form>
  );
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const sku = searchParams.get("sku");
  const { slug } = useParams<{ slug: string }>();

  const { data: plant } = usePlantBySlug(slug);

  return (
    <main className="w-full space-y-4">
      <div className="w-full max-w-350 mx-auto px-4 py-10 space-y-10">
        <BreadcrumbProductPage plant={plant?.data} />
        <div className="w-full grid lg:grid-cols-3 gap-10">
          <ProductImages
            plant={plant?.data}
            className="lg:col-span-1 col-span-3"
          />
          <div className="w-full lg:col-span-2 col-span-3">
            <ProductDetails plant={plant?.data} sku={sku} />
          </div>
        </div>
      </div>
    </main>
  );
}
