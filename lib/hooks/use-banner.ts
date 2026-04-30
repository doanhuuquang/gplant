import {
  createBanner,
  getBanners,
  getActiveBanners,
  deleteBanner,
  toggleActiveBanner,
  updateBanner,
} from "@/lib/api/banner";
import { UpdateBannerRequest } from "@/types/banner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const bannerKeys = {
  all: ["banners"] as const,
  active: ["banners", "active"] as const,
  list: () => ["banners"] as const,
  listActive: () => ["banners", "active"] as const,
  detail: (id: string) => ["banners", id] as const,
};

export const useBanners = () => {
  return useQuery({
    queryKey: bannerKeys.list(),
    queryFn: () => getBanners(),
  });
};

export const useActiveBanners = () => {
  return useQuery({
    queryKey: bannerKeys.listActive(),
    queryFn: () => getActiveBanners(),
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBanner,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      queryClient.invalidateQueries({ queryKey: bannerKeys.active });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdateBannerRequest;
    }) => updateBanner(id, request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      queryClient.invalidateQueries({ queryKey: bannerKeys.active });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useToggleActiveBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleActiveBanner,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      queryClient.invalidateQueries({ queryKey: bannerKeys.active });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.all });
      queryClient.invalidateQueries({ queryKey: bannerKeys.active });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};
