import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LightningSaleItemResponse } from "@/lib/schemas/lightning-sale/lightning-sale-item-response";
import LightningSaleCard from "@/components/shared/lightning-sale-card";

interface LightningSaleCarouselProps {
  title?: string;
  lightningSaleItems: LightningSaleItemResponse[];
  timeRemaining?: string | null;
  className?: string;
}

export default function LightningSaleCarousel({
  title,
  lightningSaleItems,
  className,
}: LightningSaleCarouselProps) {
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
          {lightningSaleItems.map((item) => (
            <CarouselItem
              key={item.id}
              className="w-full max-w-xl px-2 md:basis-1/2 lg:basis-1/3"
            >
              <LightningSaleCard lightningSaleItem={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
