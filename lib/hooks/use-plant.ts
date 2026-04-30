import { GetPlantsParams } from "@/lib/api/plant";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPlants,
  getPlantById,
  getPlantBySlug,
  createPlant,
  updatePlant,
  deletePlant,
  toggleActivePlant,
  getPlantImagesByPlantId,
  createPlantImage,
  deletePlantImage,
  setPrimaryPlantImage,
  getPlantVariantsByPlantId,
  createPlantVariant,
  updatePlantVariant,
  deletePlantVariant,
  toggleActivePlantVariant,
} from "@/lib/api/plant";
import {
  UpdatePlantRequest,
  CreatePlantImageRequest,
  UpdatePlantVariantRequest,
  CreatePlantVariantRequest,
} from "@/types/plant";

export const plantQueryKey = {
  all: ["plants"] as const,
  list: (params?: GetPlantsParams) => ["plants", "list", params] as const,
  detail: (id: string) => ["plants", "detail", id] as const,
  slug: (slug: string) => ["plants", "slug", slug] as const,
  images: (plantId: string) => ["plants", "images", plantId] as const,
  variants: (plantId: string) => ["plants", "variants", plantId] as const,
};

export function usePlants(params?: GetPlantsParams) {
  return useQuery({
    queryKey: plantQueryKey.list(params),
    queryFn: () => getPlants(params || {}),
  });
}

export function usePlant(id: string) {
  return useQuery({
    queryKey: plantQueryKey.detail(id),
    queryFn: () => getPlantById(id),
    enabled: !!id,
  });
}

export function usePlantBySlug(slug: string) {
  return useQuery({
    queryKey: plantQueryKey.slug(slug),
    queryFn: () => getPlantBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreatePlant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlant,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: plantQueryKey.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}

export function useUpdatePlant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdatePlantRequest;
    }) => updatePlant(id, request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: plantQueryKey.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}

export function useDeletePlant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlant(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: plantQueryKey.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}

export function useToggleActivePlant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleActivePlant(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: plantQueryKey.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}

export function usePlantImages(plantId: string) {
  return useQuery({
    queryKey: plantQueryKey.images(plantId),
    queryFn: () => getPlantImagesByPlantId(plantId),
    enabled: !!plantId,
  });
}

export function useCreatePlantImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePlantImageRequest) => createPlantImage(input),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: plantQueryKey.images(variables.plantId),
      });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}

export function useDeletePlantImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlantImage(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["plants", "images"] });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}

export function useSetPrimaryPlantImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setPrimaryPlantImage(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["plants", "images"] });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}

export function usePlantVariants(plantId: string) {
  return useQuery({
    queryKey: plantQueryKey.variants(plantId),
    queryFn: () => getPlantVariantsByPlantId(plantId),
    enabled: !!plantId,
  });
}

export function useCreatePlantVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePlantVariantRequest) => createPlantVariant(input),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: plantQueryKey.variants(variables.plantId),
      });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}

export function useUpdatePlantVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdatePlantVariantRequest;
    }) => updatePlantVariant(id, request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["plants", "variants"] });
      queryClient.invalidateQueries({ queryKey: plantQueryKey.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}

export function useDeletePlantVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePlantVariant(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["plants", "variants"] });
      queryClient.invalidateQueries({ queryKey: plantQueryKey.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}

export function useToggleActivePlantVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleActivePlantVariant(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["plants", "variants"] });
      queryClient.invalidateQueries({ queryKey: plantQueryKey.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
}
