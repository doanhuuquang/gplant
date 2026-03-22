import PlantResponse from "@/lib/schemas/plant/plant-response";
import { getPlants } from "@/services/plant-service";
import { PagedResult } from "@/lib/schemas/paged-result";
import { useEffect, useState } from "react";

export default function useGetBestSellingIndoorPlants() {
  const [bestSellingIndoorPlants, setBestSellingIndoorPlants] = useState<
    PlantResponse[]
  >([]);
  const [
    isGettingBestSellingIndoorPlants,
    setIsGettingBestSellingIndoorPlants,
  ] = useState<boolean>(true);
  const [getBestSellingIndoorPlantsError, setGetBestSellingIndoorPlantsError] =
    useState<string | null>(null);

  useEffect(() => {
    const handleGetBestSellingIndoorPlants = async () => {
      try {
        setIsGettingBestSellingIndoorPlants(true);
        setGetBestSellingIndoorPlantsError(null);

        const response = await getPlants();
        const data = response.data as PagedResult<PlantResponse>;

        setBestSellingIndoorPlants(data.items);
      } catch (e) {
        const err = e as Error;
        setGetBestSellingIndoorPlantsError(err.message);
      } finally {
        setIsGettingBestSellingIndoorPlants(false);
      }
    };

    handleGetBestSellingIndoorPlants();
  }, []);

  return {
    bestSellingIndoorPlants,
    isGettingBestSellingIndoorPlants,
    getBestSellingIndoorPlantsError,
  };
}
