"use client";

import BannerResponse from "@/lib/schemas/banner/banner-response";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { getActiveBanners } from "@/services/banner-service";
import { useEffect, useState } from "react";

export function useGetActiveBanners() {
  const [activeBanners, setActiveBanners] = useState<BannerResponse[]>([]);
  const [isGettingActiveBanners, setIsGettingActiveBanners] =
    useState<boolean>(true);
  const [getActiveBannersError, setGetActiveBannersError] = useState<
    string | null
  >(null);

  useEffect(() => {
    const handleGetActiveBanners = async () => {
      try {
        setIsGettingActiveBanners(true);
        setGetActiveBannersError(null);

        const response = await getActiveBanners();
        setActiveBanners(response.data as BannerResponse[]);
      } catch (e) {
        const err = e as ApiErrorResponse;
        setGetActiveBannersError(err.message);
      } finally {
        setIsGettingActiveBanners(false);
      }
    };

    handleGetActiveBanners();
  }, []);

  return { activeBanners, isGettingActiveBanners, getActiveBannersError };
}
