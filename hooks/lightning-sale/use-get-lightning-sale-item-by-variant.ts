"use client";

import { LightningSaleItemResponse } from "@/lib/schemas/lightning-sale/lightning-sale-item-response";
import PlantResponse from "@/lib/schemas/plant/plant-response";
import { getLightningSaleItemByVariantId } from "@/services/lightning-sale-service";
import { useEffect, useState } from "react";

export function useGetLightningSaleItemByVariant(
  plant?: PlantResponse | null,
  sku?: string | null,
) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [lightningSaleItemByVariant, setLightningSaleItemByVariant] =
    useState<LightningSaleItemResponse | null>(null);

  useEffect(() => {
    const setDefaultVariant = () => {
      if (sku) {
        const variant = plant?.variants.find((variant) => variant.sku === sku);
        if (variant) setSelectedVariantId(variant.id);
      } else {
        setSelectedVariantId(plant?.variants[0].id || "");
      }
    };

    setDefaultVariant();
  }, [sku, plant]);

  useEffect(() => {
    const fetchLightningSaleItem = async () => {
      setLightningSaleItemByVariant(null);
      if (!selectedVariantId) return;

      const response = await getLightningSaleItemByVariantId(selectedVariantId);
      console.log("API response for lightning sale item by variant:", response);
      if (response.data) {
        setLightningSaleItemByVariant(
          response.data as LightningSaleItemResponse,
        );
      }
    };

    fetchLightningSaleItem();
  }, [selectedVariantId]);

  return {
    lightningSaleItemByVariant,
    selectedVariantId,
    setSelectedVariantId,
  };
}
