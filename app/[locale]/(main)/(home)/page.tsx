"use client";

import LightningSaleCarousel from "@/components/feature/lightning-sale/lightning-sale-carousel";
import PlantCarousel from "@/components/feature/plant/plant-carousel";
import PopUp from "@/components/common/pop-up";
import { BannerGroup } from "@/lib/enums/banner-group";
import { useOngoingLightningSales } from "@/lib/hooks/use-lightning-sale";
import { usePlants } from "@/lib/hooks/use-plant";

import BannerCarousel from "@/app/[locale]/(main)/(home)/banner-carousel";

export default function Home() {
  const {
    data: bestSellingIndoorPlants,
    isLoading: isLoadingBestSellingIndoorPlants,
  } = usePlants();
  const { data: ongoingLightningSales } = useOngoingLightningSales();

  return (
    <main className="w-full space-y-4">
      <PopUp popUpPage={BannerGroup.HomePopup} />
      <div className="w-full max-w-350 mx-auto p-4 space-y-10">
        <BannerCarousel />
        {ongoingLightningSales?.data &&
          ongoingLightningSales?.data.length > 0 && (
            <LightningSaleCarousel
              title={ongoingLightningSales.data[0].name}
              lightningSaleItems={ongoingLightningSales.data[0].items}
              timeRemaining={ongoingLightningSales.data[0].timeRemaining}
            />
          )}
        <PlantCarousel
          title="Cây trồng trong nhà bán chạy"
          plants={bestSellingIndoorPlants?.data.items || []}
          isLoading={isLoadingBestSellingIndoorPlants}
        />
      </div>
    </main>
  );
}
