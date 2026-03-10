"use client";

import * as React from "react";
import PlantResponse from "@/lib/schemas/plant/plant-response";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { getPlantBySlug } from "@/services/plant-service";

export function useGetPlantBySlug(slug: string) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [plant, setPlant] = React.useState<PlantResponse | null>(null);

  const fetchPlant = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getPlantBySlug(slug);
      setPlant(response.data as PlantResponse);
    } catch (e) {
      const err = e as ApiErrorResponse;
      setError(err.message ?? "Failed to load plant.");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  React.useEffect(() => {
    fetchPlant();
  }, [fetchPlant]);

  return {
    plant,
    isLoading,
    error,
    refetch: fetchPlant,
  };
}
