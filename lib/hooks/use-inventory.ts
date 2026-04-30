import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getInventories,
  getInventoryOfVariant,
  getLowStockItems,
  getOutOfStockItems,
  createInventory,
  updateInventory,
  adjustInventoryApi,
  deleteInventory,
} from "@/lib/api/inventory";
import {
  AdjustInventoryRequest,
  UpdateInventoryRequest,
} from "@/types/inventory";

export const inventoryKeys = {
  all: ["inventories"] as const,
  list: () => ["inventories"] as const,
  variant: (variantId: string) =>
    ["inventories", "variant", variantId] as const,
  lowStock: (threshold: number = 10) =>
    ["inventories", "low-stock", threshold] as const,
  outOfStock: () => ["inventories", "out-of-stock"] as const,
  detail: (id: string) => ["inventories", id] as const,
};

export const useInventories = () =>
  useQuery({
    queryKey: inventoryKeys.list(),
    queryFn: getInventories,
  });

export const useInventoryOfVariant = (variantId: string) =>
  useQuery({
    queryKey: inventoryKeys.variant(variantId),
    queryFn: () => getInventoryOfVariant(variantId),
    enabled: !!variantId,
  });

export const useLowStockItems = (threshold: number = 10) =>
  useQuery({
    queryKey: inventoryKeys.lowStock(threshold),
    queryFn: () => getLowStockItems(threshold),
  });

export const useOutOfStockItems = () =>
  useQuery({
    queryKey: inventoryKeys.outOfStock(),
    queryFn: getOutOfStockItems,
  });

export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInventory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryRequest }) =>
      updateInventory(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(variables.id),
      });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useAdjustInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdjustInventoryRequest }) =>
      adjustInventoryApi(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: inventoryKeys.detail(variables.id),
      });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInventory(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};
