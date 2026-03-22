import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "@/components/shared/product-card";
import PlantResponse from "@/lib/schemas/plant/plant-response";
import { Skeleton } from "@/components/ui/skeleton";

interface PlantCarouselProps {
  title?: string;
  plants: PlantResponse[];
  isLoading?: boolean;
  className?: string;
}

export default function PlantCarousel({
  title,
  plants,
  isLoading,
  className,
}: PlantCarouselProps) {
  return (
    <div className={cn("w-full space-y-5", className)}>
      <div className="w-full">
        <p className="w-fit text-2xl font-semibold border-primary">{title}</p>
      </div>

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
        className="w-full "
      >
        <CarouselContent className="w-full ml-0">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="px-2 basis-1/2 md:basis-1/4 lg:basis-1/6 space-y-2"
                >
                  <Skeleton className="w-full aspect-square" />
                  <Skeleton className="w-full h-10" />
                </CarouselItem>
              ))
            : plants.map((plant) => (
                <CarouselItem
                  key={plant.id}
                  className="px-2 basis-1/2 md:basis-1/4 lg:basis-1/6"
                >
                  <ProductCard product={plant} />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
