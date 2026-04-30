import Image from "next/image";
import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { ExternalLink } from "lucide-react";
import { getFileUrl } from "@/utils/helpers";
import { PlantResponse } from "@/types/plant";

interface ProductCardProps {
  product: PlantResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage: string = getFileUrl(
    product.images?.find((img) => img.isPrimary)?.media?.fileUrl,
  );

  const formatPrice = (): string => {
    if (product.minPrice == null && product.maxPrice == null) {
      return "—";
    }

    const fmt = (v: number) =>
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(v);

    if (product.minPrice === product.maxPrice) {
      return fmt(product.minPrice!);
    }

    return `${fmt(product.minPrice!)} – ${fmt(product.maxPrice!)}`;
  };

  return (
    <Link
      href={`${APP_PATHS.SHOP_PRODUCT}${product.slug}`}
      className="w-full space-y-4 group"
    >
      <div className="relative">
        <Image
          src={primaryImage}
          alt={product.name}
          width={100}
          height={100}
          unoptimized
          className="w-full rounded-sm"
        />
        <div className="w-full h-full bg-black/30 absolute top-0 left-0 rounded-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
          <ExternalLink className="text-white size-2 group-hover:size-7 transition-all" />
        </div>
      </div>
      <div>
        <p className="font-medium truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {product.shortDescription}
        </p>
      </div>
      <p className="font-semibold">{formatPrice()}</p>
    </Link>
  );
}
