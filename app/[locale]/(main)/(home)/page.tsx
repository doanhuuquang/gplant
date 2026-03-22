"use client";

import LightningSaleCarousel from "@/components/shared/lightning-sale-carousel";
import PlantCarousel from "@/components/shared/plant-carousel";
import PopUp from "@/components/shared/pop-up";
import useGetBestSellingIndoorPlants from "@/hooks/plant/use-get-best-selling-indoor-plants";
import { BannerGroup } from "@/lib/enums/banner-group";
import { useGetOngoingLightningSales } from "@/hooks/lightning-sale/use-get-ongoing-lightning-sale";

import BannerCarousel from "@/app/[locale]/(main)/(home)/banner-carousel";

export default function Home() {
  const { bestSellingIndoorPlants, isGettingBestSellingIndoorPlants } =
    useGetBestSellingIndoorPlants();
  const { ongoingLightningSales } = useGetOngoingLightningSales();

  return (
    <main className="w-full space-y-4">
      <PopUp popUpPage={BannerGroup.HomePopup} />
      <div className="w-full max-w-350 mx-auto p-4 space-y-10">
        <BannerCarousel />
        {ongoingLightningSales.length > 0 && (
          <LightningSaleCarousel
            title={ongoingLightningSales[0].name}
            lightningSaleItems={ongoingLightningSales[0].items}
            timeRemaining={ongoingLightningSales[0].timeRemaining}
          />
        )}
        <PlantCarousel
          title="Best Selling Indoor Plants"
          plants={bestSellingIndoorPlants}
          isLoading={isGettingBestSellingIndoorPlants}
        />
      </div>
    </main>
  );
}
