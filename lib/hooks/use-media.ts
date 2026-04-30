import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMedia,
  getMediasByFolder,
  GetMediasParams,
  uploadMedia,
} from "@/lib/api/media";

export const mediaKeys = {
  all: ["medias"] as const,
  list: (folderId: string, params: GetMediasParams) =>
    ["medias", folderId, params] as const,
};

export const useMediasByFoder = (folderId: string, params: GetMediasParams) => {
  return useQuery({
    queryKey: mediaKeys.list(folderId, params),
    queryFn: () => getMediasByFolder(folderId, params),
  });
};

export const useUploadMedia = (folderId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadMedia(folderId, file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};
