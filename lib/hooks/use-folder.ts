import { createFolder, deleteFolder, getFolders } from "@/lib/api/folder";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const folderKeys = {
  all: ["folders"] as const,
  list: () => ["folders"] as const,
};

export const useFolders = () => {
  return useQuery({
    queryKey: folderKeys.list(),
    queryFn: () => getFolders(),
  });
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFolder(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};
