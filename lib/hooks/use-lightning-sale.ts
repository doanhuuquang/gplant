import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLightningSales,
  getActiveLightningSales,
  getUpcomingLightningSales,
  getOngoingLightningSales,
  getCurrentActiveSale,
  getLightningSaleById,
  createLightningSale,
  updateLightningSale,
  deleteLightningSale,
  activeLightningSale,
  deactiveLightningSale,
  createLightningSaleItem,
  updateLightningSaleItem,
  deleteLightningSaleItem,
  getLightningSaleItemByPlantVariantId,
} from "@/lib/api/lightning-sale";
import {
  CreateLightningSaleItemRequest,
  UpdateLightningSaleItemRequest,
  UpdateLightningSaleRequest,
} from "@/types/lightning-sale";

export const lightningSaleKeys = {
  all: ["lightning-sales"] as const,
  list: () => ["lightning-sales"] as const,
  active: () => ["lightning-sales", "active"] as const,
  upcoming: () => ["lightning-sales", "upcoming"] as const,
  ongoing: () => ["lightning-sales", "ongoing"] as const,
  current: () => ["lightning-sales", "current"] as const,
  detail: (id: string) => ["lightning-sales", id] as const,
  itemByVariant: (variantId: string) =>
    ["lightning-sales", "item", variantId] as const,
};

export const useLightningSales = () =>
  useQuery({
    queryKey: lightningSaleKeys.list(),
    queryFn: getLightningSales,
  });

export const useActiveLightningSales = () =>
  useQuery({
    queryKey: lightningSaleKeys.active(),
    queryFn: getActiveLightningSales,
  });

export const useUpcomingLightningSales = () =>
  useQuery({
    queryKey: lightningSaleKeys.upcoming(),
    queryFn: getUpcomingLightningSales,
  });

export const useOngoingLightningSales = () =>
  useQuery({
    queryKey: lightningSaleKeys.ongoing(),
    queryFn: getOngoingLightningSales,
  });

export const useCurrentActiveSale = () =>
  useQuery({
    queryKey: lightningSaleKeys.current(),
    queryFn: getCurrentActiveSale,
  });

export const useLightningSaleById = (id: string) =>
  useQuery({
    queryKey: lightningSaleKeys.detail(id),
    queryFn: () => getLightningSaleById(id),
    enabled: !!id,
  });

export const useCreateLightningSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLightningSale,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: lightningSaleKeys.all });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useUpdateLightningSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateLightningSaleRequest;
    }) => updateLightningSale(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: lightningSaleKeys.all });
      queryClient.invalidateQueries({
        queryKey: lightningSaleKeys.detail(variables.id),
      });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useDeleteLightningSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLightningSale(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: lightningSaleKeys.all });
      queryClient.invalidateQueries({ queryKey: lightningSaleKeys.detail(id) });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useActiveLightningSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activeLightningSale,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: lightningSaleKeys.all });
      queryClient.invalidateQueries({ queryKey: lightningSaleKeys.active() });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useDeactiveLightningSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactiveLightningSale,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: lightningSaleKeys.all });
      queryClient.invalidateQueries({ queryKey: lightningSaleKeys.active() });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useCreateLightningSaleItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lightningSaleId,
      data,
    }: {
      lightningSaleId: string;
      data: CreateLightningSaleItemRequest;
    }) => createLightningSaleItem(lightningSaleId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: lightningSaleKeys.all });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useUpdateLightningSaleItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lightningSaleItemId,
      data,
    }: {
      lightningSaleItemId: string;
      data: UpdateLightningSaleItemRequest;
    }) => updateLightningSaleItem(lightningSaleItemId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: lightningSaleKeys.all });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useDeleteLightningSaleItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLightningSaleItem(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: lightningSaleKeys.all });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useLightningSaleItemByPlantVariantId = (plantVariantId: string) =>
  useQuery({
    queryKey: lightningSaleKeys.itemByVariant(plantVariantId),
    queryFn: () => getLightningSaleItemByPlantVariantId(plantVariantId),
    enabled: !!plantVariantId,
  });
