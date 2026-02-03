import HomeCarousel from "@/components/shared/home-carousel";
import PopUp from "@/components/shared/pop-up";
import { BannerGroup } from "@/lib/enums/banner-group";

export default function Home() {
  return (
    <main className="w-full space-y-4 p-4">
      <div className="w-full max-w-350 mx-auto">
        <PopUp popUpPage={BannerGroup.HomePopup} />
        <HomeCarousel />
      </div>
    </main>
  );
}
