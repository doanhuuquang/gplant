import { toast } from "sonner";
import { UpdateCategoryRequest } from "@/types/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getActiveCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleActiveCategory,
} from "@/lib/api/category";

export const categoryKeys = {
  all: ["categories"] as const,
  active: ["categories", "active"] as const,
  list: () => ["categories"] as const,
  listActive: () => ["categories", "active"] as const,
  detail: (id: string) => ["categories", id] as const,
  slug: (slug: string) => ["categories", "slug", slug] as const,
};

export const useCategories = () =>
  useQuery({
    queryKey: categoryKeys.list(),
    queryFn: getCategories,
  });

export const useActiveCategories = () =>
  useQuery({
    queryKey: categoryKeys.listActive(),
    queryFn: getActiveCategories,
  });

export const useCategoryById = (id: string) =>
  useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });

export const useCategoryBySlug = (slug: string) =>
  useQuery({
    queryKey: categoryKeys.slug(slug),
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdateCategoryRequest;
    }) => updateCategory(id, request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useToggleActiveCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleActiveCategory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};
