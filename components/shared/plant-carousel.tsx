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

interface PlantCarouselProps {
  title?: string;
  plants: PlantResponse[];
  className?: string;
}

export default function PlantCarousel({
  title,
  plants,
  className,
}: PlantCarouselProps) {
  return (
    <div className={cn("w-full space-y-5", className)}>
      <div className="w-full">
        <p className="w-fit text-2xl font-semibold border-primary">{title}</p>
        <div className="w-full h-[0.3px] bg-muted mt-2"></div>
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
          {plants.map((plant) => (
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
