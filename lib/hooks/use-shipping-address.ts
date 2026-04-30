import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShippingAddress,
  deleteShippingAddress,
  getShippingAddressesByUserId,
  updateShippingAddress,
} from "@/lib/api/shipping-address";
import {
  CreateShippingAddressRequest,
  UpdateShippingAddressRequest,
} from "@/types/shipping-address";

export const shippingAddressKeys = {
  all: ["shipping-addresses"] as const,
  list: (userId: string) => ["shipping-addresses", userId] as const,
};

export const useShippingAddresses = (userId: string) => {
  return useQuery({
    queryKey: shippingAddressKeys.list(userId),
    queryFn: () => getShippingAddressesByUserId(userId),
    enabled: !!userId,
  });
};

export const useCreateShippingAddress = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateShippingAddressRequest) =>
      createShippingAddress(userId, request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: shippingAddressKeys.list(userId),
      });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useUpdateShippingAddress = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      shippingAddressId,
      request,
    }: {
      shippingAddressId: string;
      request: UpdateShippingAddressRequest;
    }) => updateShippingAddress(shippingAddressId, request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: shippingAddressKeys.list(userId),
      });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useDeleteShippingAddress = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shippingAddressId: string) =>
      deleteShippingAddress(shippingAddressId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: shippingAddressKeys.list(userId),
      });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};
