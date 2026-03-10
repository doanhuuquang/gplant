"use client";

import AddToCartRequest from "@/lib/schemas/cart/add-to-cart-request";
import Image from "next/image";
import Link from "next/link";
import PlantResponse from "@/lib/schemas/plant/plant-response";
import z from "zod";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { formatPrice, getFileUrl } from "@/utils/helpers";
import { Gem, LoaderCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetLightningSaleItemByVariant } from "@/hooks/lightning-sale/use-get-lightning-sale-item-by-variant";
import { useGetPlantBySlug } from "@/hooks/plant/use-get-plant-by-slug";
import { useGetPlantByVariant } from "@/hooks/inventory/use-get-inventory-by-variant";
import { useParams, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import InventoryResponse from "@/lib/schemas/inventory/inventory-response";

function BreadcrumbProductPage({ plant }: { plant?: PlantResponse | null }) {
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
            alt={plant?.name || "Product Image"}
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

function WateringIcon() {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 25.8"
      className="w-7 h-7"
    >
      <polygon
        fill="#D6CD1E"
        points="0.7,9.6 3.8,9.8 5.4,8.5 5.8,5.5 	"
      ></polygon>
      <polygon
        fill="#08BF86"
        points="5.4,8.5 3.8,9.8 8.9,25.2 10.1,14.1 	"
      ></polygon>
      <path
        fill="#F7F70B"
        d="M17.2,0.7c-4.3,0-6,3.9-6,3.9h12C23.2,4.6,21.5,0.7,17.2,0.7"
      ></path>
      <polygon
        fill="#7AE3C5"
        points="23.2,4.6 11.2,4.6 8.9,25.2 25.5,25.2 	"
      ></polygon>
      <polygon
        fill="#08BF86"
        points="23.2,4.6 11.2,4.6 18,4.6 20.3,25.2 25.5,25.2 	"
      ></polygon>
      <path
        d="M26.1,25.1L23.8,4.5c0-0.3-0.3-0.6-0.7-0.6h-12c-0.3,0-0.6,0.3-0.7,0.6L8.2,25.1c0,0.2,0,0.4,0.2,0.5
									c0.1,0.1,0.3,0.2,0.5,0.2h16.6c0.2,0,0.4-0.1,0.5-0.2C26.1,25.5,26.2,25.3,26.1,25.1 M9.7,24.5l2.2-19.2h10.8l2.1,19.2H9.7z"
      ></path>
      <path d="M23.6,7.4H10.8c-0.4,0-0.7,0.3-0.7,0.7c0,0.4,0.3,0.7,0.7,0.7h12.7c0.4,0,0.7-0.3,0.7-0.7C24.2,7.7,23.9,7.4,23.6,7.4"></path>
      <path
        d="M23.8,4.3C23.7,4.2,21.9,0,17.2,0c-4.7,0-6.5,4.2-6.6,4.3c-0.1,0.2-0.1,0.4,0.1,0.6c0.1,0.2,0.3,0.3,0.6,0.3h12
									c0.2,0,0.4-0.1,0.6-0.3C23.9,4.8,23.9,4.6,23.8,4.3 M12.4,3.9c0.7-1,2.2-2.6,4.8-2.6c2.6,0,4.1,1.5,4.8,2.6H12.4z"
      ></path>
      <path
        d="M10.7,13.6L5.9,8.1C5.7,7.8,5.3,7.8,5,8L3.3,9.3C3.1,9.5,3,9.8,3.1,10.1l5.1,15.3c0.1,0.3,0.4,0.5,0.6,0.5c0,0,0,0,0.1,0
									c0.3,0,0.6-0.3,0.6-0.6l1.2-11.1C10.8,13.9,10.8,13.8,10.7,13.6 M8.6,22.1l-4-12l0.8-0.6l4.1,4.8L8.6,22.1z"
      ></path>
      <path
        d="M6.1,4.9C5.9,4.8,5.6,4.8,5.4,5L0.3,9C0,9.2-0.1,9.5,0,9.8c0.1,0.3,0.3,0.5,0.6,0.5l3.1,0.3c0,0,0,0,0.1,0
									c0.2,0,0.3-0.1,0.4-0.1L5.8,9C6,8.9,6.1,8.8,6.1,8.6l0.4-3C6.5,5.3,6.3,5.1,6.1,4.9 M4.8,8.2l-1.2,1L2.4,9l2.5-2L4.8,8.2z"
      ></path>
      <path
        d="M22.4,10.7h-1.5c-0.4,0-0.7,0.3-0.7,0.7c0,0.4,0.3,0.7,0.7,0.7h1.5c2.3,0,4.3,1.9,4.3,4.3v2.8h-5.8c-0.4,0-0.7,0.3-0.7,0.7
									c0,0.4,0.3,0.7,0.7,0.7h6.4c0.4,0,0.7-0.3,0.7-0.7v-3.5C28,13.2,25.5,10.7,22.4,10.7"
      ></path>
      <rect
        x="11"
        y="16.3"
        transform="matrix(0.1048 -0.9945 0.9945 0.1048 -5.1654 27.8913)"
        fill="#FFFFFF"
        width="3.8"
        height="1"
      ></rect>
      <rect
        x="12.3"
        y="11.1"
        transform="matrix(0.1048 -0.9945 0.9945 0.1048 0.5329 23.7558)"
        fill="#FFFFFF"
        width="2.3"
        height="1"
      ></rect>
    </svg>
  );
}

function LightIcon() {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      className="w-7 h-7"
    >
      <g>
        <path
          fill="#F7F70B"
          d="M14,6.4c-4.2,0-7.6,3.4-7.6,7.6c0,4.2,3.4,7.6,7.6,7.6c4.2,0,7.6-3.4,7.6-7.6C21.6,9.8,18.2,6.4,14,6.4"
        ></path>
        <path
          fill="#D6CD1E"
          d="M14,6.4c-4.2,0-7.6,3.4-7.6,7.6c0,4.2,3.4,7.6,7.6,7.6c4.2,0,7.6-3.4,7.6-7.6C21.6,9.8,18.2,6.4,14,6.4"
        ></path>
        <path
          fill="#F7F70B"
          d="M14.9,8.3c-3.6,0-6.5,2.9-6.5,6.5c0,3.6,2.9,6.5,6.5,6.5c1,0,2-0.2,2.9-0.7c1.5-0.9,2.7-2.2,3.3-3.9
										c0.2-0.6,0.3-1.3,0.3-1.9C21.4,11.2,18.5,8.3,14.9,8.3"
        ></path>
        <path
          d="M14,5.8c-4.5,0-8.2,3.7-8.2,8.2c0,4.5,3.7,8.2,8.2,8.2c4.5,0,8.2-3.7,8.2-8.2C22.2,9.5,18.5,5.8,14,5.8 M14,20.9
										c-3.8,0-6.9-3.1-6.9-6.9c0-3.8,3.1-6.9,6.9-6.9c3.8,0,6.9,3.1,6.9,6.9C20.9,17.8,17.8,20.9,14,20.9"
        ></path>
        <path
          d="M18.4,15.4c-0.3-0.2-0.7,0-0.8,0.3c-0.7,1.3-2,2.2-3.5,2.2c-1.5,0-2.9-0.9-3.5-2.2c-0.1-0.3-0.5-0.4-0.8-0.3
										c-0.3,0.2-0.4,0.5-0.3,0.8c0.8,1.8,2.7,2.9,4.6,2.9c2,0,3.8-1.1,4.7-2.9C18.8,15.9,18.7,15.6,18.4,15.4"
        ></path>
        <path d="M4.1,13.4H0.6C0.3,13.4,0,13.6,0,14c0,0.3,0.3,0.6,0.6,0.6h3.4c0.3,0,0.6-0.3,0.6-0.6C4.7,13.6,4.4,13.4,4.1,13.4"></path>
        <path d="M27.4,13.4h-3.4c-0.3,0-0.6,0.3-0.6,0.6c0,0.3,0.3,0.6,0.6,0.6h3.4c0.3,0,0.6-0.3,0.6-0.6C28,13.6,27.7,13.4,27.4,13.4"></path>
        <path d="M14,23.3c-0.3,0-0.6,0.3-0.6,0.6v3.4c0,0.3,0.3,0.6,0.6,0.6c0.3,0,0.6-0.3,0.6-0.6v-3.4C14.6,23.6,14.3,23.3,14,23.3"></path>
        <path d="M14,0c-0.3,0-0.6,0.3-0.6,0.6v3.4c0,0.3,0.3,0.6,0.6,0.6c0.3,0,0.6-0.3,0.6-0.6V0.6C14.6,0.3,14.3,0,14,0"></path>
        <path
          d="M7.4,20.6c-0.2-0.2-0.6-0.2-0.9,0L4.1,23c-0.2,0.2-0.2,0.6,0,0.9c0.1,0.1,0.3,0.2,0.4,0.2c0.2,0,0.3-0.1,0.4-0.2l2.4-2.4
										C7.7,21.2,7.7,20.8,7.4,20.6"
        ></path>
        <path
          d="M23.9,4.1c-0.2-0.2-0.6-0.2-0.9,0l-2.4,2.4c-0.2,0.2-0.2,0.6,0,0.9c0.1,0.1,0.3,0.2,0.4,0.2c0.2,0,0.3-0.1,0.4-0.2L23.9,5
										C24.1,4.7,24.1,4.3,23.9,4.1"
        ></path>
        <path
          d="M7.4,6.5L5,4.1c-0.2-0.2-0.6-0.2-0.9,0C3.9,4.3,3.9,4.7,4.1,5l2.4,2.4C6.7,7.5,6.8,7.6,7,7.6c0.2,0,0.3-0.1,0.4-0.2
										C7.7,7.2,7.7,6.8,7.4,6.5"
        ></path>
        <path
          d="M23.9,23l-2.4-2.4c-0.2-0.2-0.6-0.2-0.9,0c-0.2,0.2-0.2,0.6,0,0.9l2.4,2.4c0.1,0.1,0.3,0.2,0.4,0.2s0.3-0.1,0.4-0.2
										C24.1,23.6,24.1,23.2,23.9,23"
        ></path>
        <path d="M11.8,11.1c-0.5,0-0.9,0.4-0.9,0.9c0,0.5,0.4,0.9,0.9,0.9c0.5,0,0.9-0.4,0.9-0.9C12.7,11.5,12.3,11.1,11.8,11.1"></path>
        <path d="M16.3,11.1c-0.5,0-0.9,0.4-0.9,0.9c0,0.5,0.4,0.9,0.9,0.9c0.5,0,0.9-0.4,0.9-0.9C17.2,11.5,16.8,11.1,16.3,11.1"></path>
      </g>
    </svg>
  );
}

function TemperatureIcon() {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 25.7"
      className="w-7 h-7"
    >
      <g>
        <path
          fill="#7AE3C5"
          d="M24.9,16.1V5.5c0-1.3-1.1-2.4-2.4-2.4c-1.3,0-2.4,1.1-2.4,2.4v10.5c-1.5,0.8-2.4,2.4-2.4,4.3
										c0.1,2.6,2.2,4.7,4.8,4.7c2.7,0,4.8-2.2,4.8-4.8C27.3,18.4,26.4,16.9,24.9,16.1"
        ></path>
        <path d="M8.1,5C7.7,5,7.4,5.3,7.4,5.7V25c0,0.4,0.3,0.7,0.7,0.7c0.4,0,0.7-0.3,0.7-0.7V5.7C8.7,5.3,8.4,5,8.1,5"></path>
        <path
          fill="#95D600"
          d="M16.7,9.3c-1.8-0.9-4.1-0.9-6,0.4C8.9,10.9,7.9,13,8.1,15c1.8,0.9,4.1,0.9,6-0.4C15.9,13.5,16.8,11.4,16.7,9.3
										"
        ></path>
        <path
          fill="#6CA439"
          d="M10.7,9.7C8.9,10.9,8.1,15,8.1,15l8.6-5.7C16.7,9.3,12.6,8.5,10.7,9.7"
        ></path>
        <path
          d="M17.4,9.3c0-0.2-0.2-0.4-0.4-0.5c-2.1-1.1-4.7-0.9-6.6,0.4c-2,1.3-3.1,3.6-3,5.9c0,0.2,0.2,0.4,0.4,0.5
										c0.9,0.5,2,0.7,3,0.7c1.3,0,2.6-0.4,3.7-1.1C16.4,13.9,17.5,11.7,17.4,9.3 M13.7,14.1c-1.5,1-3.3,1.1-5,0.5c0-1.8,0.9-3.4,2.4-4.4
										c1.5-1,3.3-1.1,5-0.5C16,11.5,15.1,13.2,13.7,14.1"
        ></path>
        <path
          fill="#95D600"
          d="M5.9,12c-1.5-1-3.2-1-4.7-0.3c-0.1,1.6,0.7,3.3,2.1,4.2c1.5,1,3.2,1,4.7,0.3C8.1,14.5,7.4,12.9,5.9,12"
        ></path>
        <path
          fill="#6CA439"
          d="M8,16.2c-1.5,0.7-3.2,0.7-4.7-0.3c-1.5-1-2.2-2.6-2.1-4.2"
        ></path>
        <path
          d="M6.3,11.4c-1.6-1.1-3.6-1.2-5.4-0.3c-0.2,0.1-0.3,0.3-0.4,0.5c-0.1,1.9,0.8,3.7,2.4,4.8c0.9,0.6,1.9,0.9,3,0.9
										c0.8,0,1.6-0.2,2.4-0.6c0.2-0.1,0.3-0.3,0.4-0.5C8.8,14.3,7.9,12.5,6.3,11.4 M3.7,15.3c-1.1-0.7-1.8-1.9-1.8-3.2
										c1.2-0.5,2.6-0.3,3.7,0.4s1.8,1.9,1.8,3.2C6.2,16.2,4.8,16.1,3.7,15.3"
        ></path>
        <path
          d="M22.7,24.4H3.9c-1.4,0-2.6-1.2-2.6-2.6c0-1.4,1.2-2.6,2.6-2.6h0.7c0.4,0,0.7-0.3,0.7-0.7c0-0.4-0.3-0.7-0.7-0.7H3.9
										c-2.2,0-3.9,1.8-3.9,3.9c0,2.2,1.8,3.9,3.9,3.9h18.8c0.4,0,0.7-0.3,0.7-0.7S23,24.4,22.7,24.4"
        ></path>
        <path
          fill="#7AE3C5"
          d="M8.3,7.1c-1,0-1.7,1.4-1.7,3.2s0.8,3.2,1.7,3.2c1,0,1.7-1.4,1.7-3.2S9.3,7.1,8.3,7.1"
        ></path>
        <path
          fill="#7AE3C5"
          d="M8.3,0.7c-1,0-1.7,1.4-1.7,3.2c0,1.8,0.8,3.2,1.7,3.2c1,0,1.7-1.4,1.7-3.2C10.1,2.1,9.3,0.7,8.3,0.7"
        ></path>
        <path
          d="M8.3,6.4c-1.4,0-2.4,1.7-2.4,3.9c0,2.2,1,3.9,2.4,3.9c1.4,0,2.4-1.7,2.4-3.9C10.7,8.1,9.7,6.4,8.3,6.4 M8.3,12.8
										c-0.2,0-0.5-0.2-0.7-0.6c-0.3-0.5-0.4-1.2-0.4-1.9c0-1.5,0.7-2.5,1.1-2.5c0.2,0,0.5,0.2,0.7,0.6c0.3,0.5,0.4,1.2,0.4,1.9
										C9.4,11.8,8.8,12.8,8.3,12.8"
        ></path>
        <path
          d="M8.3,0C7,0,5.9,1.7,5.9,3.9s1,3.9,2.4,3.9c1.4,0,2.4-1.7,2.4-3.9S9.7,0,8.3,0 M8.3,6.4c-0.2,0-0.5-0.2-0.7-0.6
										C7.4,5.3,7.3,4.6,7.3,3.9c0-1.5,0.7-2.5,1.1-2.5c0.2,0,0.5,0.2,0.7,0.6c0.3,0.5,0.4,1.2,0.4,1.9C9.4,5.4,8.8,6.4,8.3,6.4"
        ></path>
        <path
          fill="#7AE3C5"
          d="M11.5,5.3c-1.8,0-3.2,0.8-3.2,1.7c0,1,1.4,1.8,3.2,1.8c1.8,0,3.2-0.8,3.2-1.7C14.7,6.1,13.3,5.3,11.5,5.3"
        ></path>
        <path
          fill="#7AE3C5"
          d="M5.1,5.3C3.4,5.3,1.9,6.1,1.9,7c0,1,1.4,1.8,3.2,1.8c1.8,0,3.2-0.8,3.2-1.7C8.3,6.1,6.9,5.3,5.1,5.3"
        ></path>
        <path
          d="M11.5,4.7c-2.2,0-3.9,1-3.9,2.4c0,1.4,1.7,2.4,3.9,2.4s3.9-1,3.9-2.4C15.4,5.7,13.7,4.7,11.5,4.7 M13.5,7.7
										C13,8,12.3,8.1,11.5,8.1C10,8.1,9,7.5,9,7.1c0-0.2,0.2-0.5,0.6-0.7C10.1,6.1,10.8,6,11.5,6c1.5,0,2.5,0.7,2.5,1.1
										C14.1,7.3,13.9,7.5,13.5,7.7"
        ></path>
        <path
          d="M5.1,4.7c-2.2,0-3.9,1-3.9,2.4c0,1.4,1.7,2.4,3.9,2.4c2.2,0,3.9-1,3.9-2.4C9,5.7,7.3,4.7,5.1,4.7 M7.1,7.7
										C6.6,8,5.9,8.1,5.1,8.1c-1.5,0-2.5-0.7-2.5-1.1c0-0.2,0.2-0.5,0.6-0.7C3.7,6.1,4.4,6,5.1,6c1.5,0,2.5,0.7,2.5,1.1
										C7.7,7.3,7.5,7.5,7.1,7.7"
        ></path>
        <path
          fill="#F7F70B"
          d="M13.2,2.2C12.5,1.5,10.8,2,9.4,3.3c-1.3,1.3-1.8,3-1.1,3.8c0.7,0.7,2.4,0.2,3.8-1.1
										C13.4,4.6,13.9,2.9,13.2,2.2"
        ></path>
        <path
          fill="#F7F70B"
          d="M8.3,7.1C7.6,6.3,5.9,6.8,4.6,8.2c-1.3,1.3-1.8,3-1.1,3.8c0.7,0.7,2.4,0.2,3.8-1.1C8.6,9.5,9.1,7.8,8.3,7.1"
        ></path>
        <path
          fill="#F7F70B"
          d="M12.1,8.2c-1.3-1.3-3-1.8-3.8-1.1c-0.7,0.7-0.2,2.4,1.1,3.8c1.3,1.3,3,1.8,3.8,1.1
										C13.9,11.2,13.4,9.5,12.1,8.2"
        ></path>
        <path
          fill="#F7F70B"
          d="M7.2,3.3C5.9,2,4.2,1.5,3.5,2.2C2.7,2.9,3.2,4.6,4.6,6c1.3,1.3,3,1.8,3.8,1.1C9.1,6.3,8.6,4.6,7.2,3.3"
        ></path>
        <path
          d="M13.7,1.7c-1-1-3-0.5-4.7,1.1C8.3,3.6,7.7,4.4,7.5,5.2C7.2,6.2,7.3,7,7.9,7.5c0.4,0.4,0.8,0.5,1.4,0.5c1,0,2.2-0.6,3.3-1.6
										c0.7-0.7,1.3-1.6,1.5-2.4C14.3,3.1,14.2,2.3,13.7,1.7 M12.8,3.7c-0.2,0.6-0.6,1.3-1.2,1.8c-1.2,1.2-2.5,1.5-2.8,1.1
										c-0.2-0.2-0.2-0.5-0.1-1C8.9,5,9.3,4.3,9.9,3.8c0.9-0.9,1.8-1.2,2.4-1.2c0.2,0,0.4,0.1,0.5,0.1C12.9,2.8,12.9,3.2,12.8,3.7"
        ></path>
        <path
          d="M8.8,6.6c-1-1-3-0.5-4.7,1.1c-0.7,0.7-1.3,1.6-1.5,2.4c-0.3,1-0.1,1.8,0.4,2.3c0.4,0.4,0.8,0.5,1.4,0.5
										c1,0,2.2-0.6,3.3-1.6C9.3,9.6,9.8,7.6,8.8,6.6 M7.9,8.5c-0.2,0.6-0.6,1.3-1.2,1.8c-1.2,1.2-2.5,1.5-2.8,1.1c-0.2-0.2-0.2-0.5-0.1-1
										c0.2-0.6,0.6-1.3,1.2-1.8c0.9-0.9,1.8-1.2,2.4-1.2c0.2,0,0.4,0,0.5,0.1C8,7.7,8.1,8.1,7.9,8.5"
        ></path>
        <path
          d="M14.1,10.1c-0.2-0.8-0.8-1.7-1.5-2.4c-1.6-1.7-3.7-2.1-4.7-1.1c-1,1-0.5,3,1.1,4.7c1.1,1.1,2.3,1.6,3.3,1.6
										c0.6,0,1-0.2,1.4-0.5C14.2,11.9,14.3,11,14.1,10.1 M12.7,11.5c-0.4,0.4-1.6,0.1-2.8-1.1c-0.6-0.6-1-1.2-1.2-1.8
										c-0.1-0.5-0.1-0.8,0.1-1c0.1-0.1,0.3-0.1,0.5-0.1c0.6,0,1.5,0.4,2.4,1.2c0.6,0.6,1,1.2,1.2,1.8C12.9,10.9,12.9,11.3,12.7,11.5"
        ></path>
        <path
          d="M9.2,5.2C9,4.4,8.4,3.6,7.7,2.8C6,1.2,4,0.7,3,1.7C2.5,2.3,2.3,3.1,2.6,4c0.2,0.8,0.8,1.7,1.5,2.4c1.1,1.1,2.3,1.6,3.3,1.6
										c0.6,0,1-0.2,1.4-0.5C9.3,7,9.5,6.2,9.2,5.2 M7.9,6.6C7.5,6.9,6.2,6.7,5.1,5.5c-0.6-0.6-1-1.2-1.2-1.8c-0.1-0.5-0.1-0.8,0.1-1
										C4,2.6,4.2,2.5,4.4,2.5c0.6,0,1.5,0.4,2.4,1.2c0.6,0.6,1,1.2,1.2,1.8C8.1,6.1,8,6.4,7.9,6.6"
        ></path>
        <path
          fill="#F7F70B"
          d="M10.2,5.2c-1-1-2.7-1-3.7,0c-1,1-1,2.7,0,3.7c1,1,2.7,1,3.7,0C11.2,7.9,11.2,6.2,10.2,5.2"
        ></path>
        <path
          fill="#FFFFFF"
          d="M9.1,6.3C8.7,5.9,8,5.9,7.6,6.3c-0.4,0.4-0.4,1.1,0,1.5c0.4,0.4,1.1,0.4,1.5,0C9.5,7.4,9.5,6.7,9.1,6.3"
        ></path>
        <path
          d="M10.7,4.7C9.4,3.4,7.3,3.4,6,4.7C4.7,6,4.7,8.1,6,9.4c0.6,0.6,1.5,1,2.3,1c0.8,0,1.7-0.3,2.3-1C12,8.1,12,6,10.7,4.7
											M9.7,8.5L9.7,8.5c-0.8,0.8-2,0.8-2.8,0c-0.8-0.8-0.8-2,0-2.8c0.4-0.4,0.9-0.6,1.4-0.6c0.5,0,1,0.2,1.4,0.6
										C10.5,6.4,10.5,7.7,9.7,8.5"
        ></path>
        <path
          d="M25.6,15.7V5.5c0-1.7-1.4-3.1-3.1-3.1c-1.7,0-3.1,1.4-3.1,3.1v10.2c-1.5,1-2.4,2.8-2.4,4.6c0.1,3,2.5,5.4,5.5,5.4
										c3,0,5.5-2.5,5.5-5.5C28,18.4,27.1,16.7,25.6,15.7 M22.5,24.4c-2.3,0-4.1-1.8-4.2-4.1c0-1.5,0.8-2.9,2.1-3.7
										c0.2-0.1,0.3-0.3,0.3-0.6V5.5c0-1,0.8-1.8,1.8-1.8c1,0,1.8,0.8,1.8,1.8v10.5c0,0.2,0.1,0.5,0.3,0.6c1.3,0.7,2.1,2.1,2.1,3.6
										C26.7,22.5,24.8,24.4,22.5,24.4"
        ></path>
        <path
          fill="#FFFFFF"
          d="M22.5,18.2c-1.1,0-2.1,0.9-2.1,2.1c0,1.1,0.9,2.1,2.1,2.1c1.1,0,2.1-0.9,2.1-2.1
										C24.6,19.1,23.7,18.2,22.5,18.2"
        ></path>
        <path
          d="M22.5,17.5c-1.5,0-2.7,1.2-2.7,2.7c0,1.5,1.2,2.7,2.7,2.7c1.5,0,2.7-1.2,2.7-2.7C25.3,18.7,24,17.5,22.5,17.5 M22.5,21.7
										c-0.8,0-1.4-0.6-1.4-1.4c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4C24,21,23.3,21.7,22.5,21.7"
        ></path>
        <path d="M21.4,6.8h-1.3c-0.4,0-0.7,0.3-0.7,0.7c0,0.4,0.3,0.7,0.7,0.7h1.3c0.4,0,0.7-0.3,0.7-0.7C22.1,7.1,21.8,6.8,21.4,6.8"></path>
        <path d="M21.4,9.8h-1.3c-0.4,0-0.7,0.3-0.7,0.7c0,0.4,0.3,0.7,0.7,0.7h1.3c0.4,0,0.7-0.3,0.7-0.7C22.1,10.1,21.8,9.8,21.4,9.8"></path>
        <path d="M21.4,12.9h-1.3c-0.4,0-0.7,0.3-0.7,0.7c0,0.4,0.3,0.7,0.7,0.7h1.3c0.4,0,0.7-0.3,0.7-0.7C22.1,13.2,21.8,12.9,21.4,12.9"></path>
        <rect x="22.7" y="9" fill="#FFFFFF" width="1" height="2.9"></rect>
        <rect x="22.7" y="7.1" fill="#FFFFFF" width="1" height="1.1"></rect>
      </g>
    </svg>
  );
}

function SoilIcon() {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 27.2"
      className="w-7 h-7"
    >
      <g>
        <path
          fill="#F7F70B"
          d="M14.4,0.9h-0.7c-1.1,0-2.1,0.9-2.1,2.1v4.4h4.8V2.9C16.4,1.8,15.5,0.9,14.4,0.9"
        ></path>
        <path
          fill="#7AE3C5"
          d="M20.8,7.3H7.2c-3.5,0-6.3,2.8-6.3,6.3v1.1h26.3v-1.1C27.1,10.2,24.3,7.3,20.8,7.3"
        ></path>
        <path
          fill="#08BF86"
          d="M8.3,7.3c-4.1,0-7.5,3.3-7.5,7.5H8c0-4.1,3.3-7.5,7.5-7.5H8.3z"
        ></path>
        <path
          d="M20.8,6.5H7.2c-4,0-7.2,3.2-7.2,7.2v2h28v-2C28,9.7,24.8,6.5,20.8,6.5 M26.3,13.9H1.7v-0.3c0-3,2.5-5.5,5.5-5.5h13.6
										c3,0,5.5,2.5,5.5,5.5V13.9z"
        ></path>
        <path
          d="M14.4,0h-0.7c-1.6,0-2.9,1.3-2.9,2.9v5.3h6.5V2.9C17.3,1.3,16,0,14.4,0 M15.6,6.5h-3.1V2.9c0-0.7,0.5-1.2,1.2-1.2h0.7
										c0.7,0,1.2,0.5,1.2,1.2V6.5z"
        ></path>
        <rect x="4.3" y="17.7" width="1.7" height="4.2"></rect>
        <rect x="10.2" y="17.7" width="1.7" height="4.2"></rect>
        <rect x="16.1" y="17.7" width="1.7" height="4.2"></rect>
        <rect x="22" y="17.7" width="1.7" height="4.2"></rect>
        <rect x="7.3" y="22.9" width="1.7" height="4.2"></rect>
        <rect x="13.1" y="22.9" width="1.7" height="4.2"></rect>
        <rect x="19" y="22.9" width="1.7" height="4.2"></rect>
        <path
          fill="#FFFFFF"
          d="M20.3,9.4l-0.1,1.3c0.1,0,1.8,0.2,2.8,2L24,12C22.7,9.7,20.4,9.4,20.3,9.4"
        ></path>
        <rect x="16.4" y="9.4" fill="#FFFFFF" width="2.3" height="1.3"></rect>
      </g>
    </svg>
  );
}

function ProductCareInstruction({ plant }: { plant?: PlantResponse | null }) {
  return (
    <main className="border rounded-sm p-4 space-y-5">
      <p className="text-xl font-semibold">Plant Care</p>
      {/* Watering */}
      <div className="flex gap-4">
        <div className="shrink-0">
          <WateringIcon />
        </div>
        <div>
          <p className="font-medium">Watering</p>
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
          <p className="font-medium">Light</p>
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
          <p className="font-medium">Temperature</p>
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
          <p className="font-medium">Soil</p>
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
  selectedVariantId,
  inventoryByVariant,
}: {
  plant?: PlantResponse | null;
  selectedVariantId?: string | null;
  inventoryByVariant?: InventoryResponse | null;
}) {
  const variant = plant?.variants.find((v) => v.id === selectedVariantId);
  if (variant?.isActive === false) {
    return (
      <Badge className="bg-destructive text-white font-semibold">
        Discontinued
      </Badge>
    );
  } else if (!inventoryByVariant || inventoryByVariant?.isOutOfStock) {
    return (
      <Badge className="bg-destructive text-white font-semibold">
        Sold Out
      </Badge>
    );
  } else if (inventoryByVariant?.isLowStock) {
    return (
      <Badge className="bg-[#F7F70B] text-[#2A2A2A] font-semibold">
        HURRY! LIMITED QTY
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
  const {
    lightningSaleItemByVariant,
    selectedVariantId,
    setSelectedVariantId,
  } = useGetLightningSaleItemByVariant(plant, sku);
  const { inventoryByVariant } = useGetPlantByVariant(selectedVariantId);
  const { handleAddToCart, isAddingToCart } = useAddToCart();

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
                    (variant) => variant.id === selectedVariantId,
                  )?.sku
                }
              </p>

              <VariantStatus
                plant={plant}
                selectedVariantId={selectedVariantId}
                inventoryByVariant={inventoryByVariant}
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold">
                  {lightningSaleItemByVariant?.salePrice
                    ? formatPrice(lightningSaleItemByVariant.salePrice)
                    : formatPrice(
                        plant?.variants.find(
                          (variant) => variant.id === selectedVariantId,
                        )?.price as number,
                      )}
                </p>
                <p className="font-semibold text-muted-foreground">Inc.vat</p>
              </div>
              {lightningSaleItemByVariant?.salePrice && (
                <div className="flex items-center gap-3">
                  <p className="line-through text-muted-foreground font-light">
                    {formatPrice(
                      plant?.variants.find(
                        (variant) => variant.id === selectedVariantId,
                      )?.price as number,
                    )}
                  </p>

                  <Badge className="bg-[#F7F70B] text-[#2A2A2A] font-semibold">
                    {`${Math.round(lightningSaleItemByVariant.discountPercentage)}% OFF`}
                  </Badge>
                </div>
              )}
            </div>

            {/* Choose Variant */}
            <div className="space-y-2">
              <p className="text-muted-foreground font-semibold">
                Choose Height
              </p>
              <div className="flex items-center gap-3">
                {plant?.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={"outline"}
                    size={"default"}
                    disabled={!variant.id || variant.id === selectedVariantId}
                    onClick={() => setSelectedVariantId(variant.id)}
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
              <p className="text-muted-foreground font-semibold">Qty</p>
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
                  inventoryByVariant.quantityAvailable <= 0 ||
                  plant?.variants.find(
                    (variant) => variant.id === selectedVariantId,
                  )?.isActive === false
                }
                onClick={async () => {
                  const request: AddToCartRequest = {
                    plantVariantId: selectedVariantId,
                    quantity: form.getValues("quantity"),
                  };

                  await handleAddToCart(request);
                }}
              >
                {isAddingToCart ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <ShoppingBag />
                )}
                Add to Cart
              </Button>

              {/* Add to wish list button */}
              <Button variant={"secondary"} className="grow">
                <Gem />
                Add to Wishlist
              </Button>
            </div>
          </div>
          <ProductCareInstruction plant={plant} />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold">Plant Bio</p>
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
  const { plant } = useGetPlantBySlug(slug);

  return (
    <main className="w-full space-y-4">
      <div className="w-full max-w-350 mx-auto px-4 py-10 space-y-10">
        <BreadcrumbProductPage plant={plant} />
        <div className="w-full grid lg:grid-cols-3 gap-10">
          <ProductImages plant={plant} className="lg:col-span-1 col-span-3" />
          <div className="w-full lg:col-span-2 col-span-3">
            <ProductDetails plant={plant} sku={sku} />
          </div>
        </div>
      </div>
    </main>
  );
}
