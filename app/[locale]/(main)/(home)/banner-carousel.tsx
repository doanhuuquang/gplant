"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { BannerGroup } from "@/lib/enums/banner-group";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/utils/helpers";
import { useGetActiveBanners } from "@/hooks/banner/use-get-active-banners";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function BannerCarousel({ className }: { className?: string }) {
  const { activeBanners } = useGetActiveBanners();

  return (
    <div className={cn("w-full", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full relative rounded-sm overflow-hidden"
      >
        <CarouselContent className="ml-0">
          {activeBanners.map(
            (banner) =>
              banner.group === BannerGroup.Carousel && (
                <CarouselItem key={banner.id} className="basis-full pl-0">
                  <Link
                    href={banner.redirectUrl || "#"}
                    className="w-full h-auto"
                  >
                    <div className="w-full h-auto relative aspect-7/3">
                      <Image
                        src={getFileUrl(banner.media?.fileUrl)}
                        alt={banner.title}
                        fill
                        unoptimized
                        className="absolute top-0 left-0 w-full h-full object-cover object-center"
                      />
                    </div>
                  </Link>
                </CarouselItem>
              ),
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
