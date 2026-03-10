"use client";

import * as React from "react";
import Image from "next/image";
import { BannerGroup } from "@/lib/enums/banner-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBannerStore } from "@/stores/banner-store";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BannerResponse from "@/lib/schemas/banner/banner-response";
import { getFileUrl } from "@/utils/helpers";

interface PopUpProps {
  popUpPage: BannerGroup.HomePopup;
  className?: string;
}

export default function PopUp({ popUpPage, className }: PopUpProps) {
  const { activeBanners } = useBannerStore();

  const [isShowPopUp, setIsShowPopUp] = React.useState(true);
  const [homePopUpBanner, setHomePopUpBanner] = React.useState<
    BannerResponse[]
  >([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const filteredBanners = activeBanners.filter(
      (banner) => banner.group === popUpPage,
    );
    setHomePopUpBanner(filteredBanners);
  }, [activeBanners, popUpPage]);

  const handleClose = () => {
    if (currentIndex < homePopUpBanner.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsShowPopUp(false);
    }
  };

  if (homePopUpBanner.length === 0 || currentIndex >= homePopUpBanner.length)
    return null;

  return (
    <main className={cn("", className)}>
      <Dialog open={isShowPopUp} onOpenChange={setIsShowPopUp}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] p-0 overflow-hidden"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{homePopUpBanner[currentIndex].title}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="relative w-full aspect-3/2">
            <Image
              src={getFileUrl(homePopUpBanner[currentIndex].media?.fileUrl)}
              alt={homePopUpBanner[currentIndex].title}
              fill
              className="w-full h-auto object-contain"
              priority
              unoptimized
            />

            <Button
              variant={"outline"}
              size={"icon"}
              className="absolute top-4 right-4 rounded-full bg-black/20 hover:bg-black/50 border-0 hover:border-0 text-white hover:text-white"
              onClick={handleClose}
            >
              <X size={20} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
