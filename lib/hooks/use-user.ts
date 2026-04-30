import { toast } from "sonner";
import { UpdateUserRequest } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  getUsers,
  updateProfile,
  updateUser,
  deleteUser,
  assignRole,
  removeRole,
  toggleLockUser,
  GetUsersParams,
  getUserById,
} from "@/lib/api/user";
import { useAuthStore } from "@/lib/stores/auth-store";

export const userKeys = {
  all: ["users"] as const,
  list: (params: GetUsersParams) => ["users", params] as const,
  detail: (id: string) => ["users", id] as const,
  me: ["users", "me"] as const,
};

export const useMe = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: userKeys.me,
    queryFn: async () => {
      const res = await getMe();
      if (res.data) setUser(res.data);
      return res;
    },
    retry: false,
  });
};

export const useUsers = (params: GetUsersParams = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateUserRequest }) =>
      updateUser(id, request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleName }: { userId: string; roleName: string }) =>
      assignRole(userId, roleName),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useRemoveRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roleName }: { userId: string; roleName: string }) =>
      removeRole(userId, roleName),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useToggleLockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleLockUser,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};
