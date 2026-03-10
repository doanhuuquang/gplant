"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useMediaStore } from "@/stores/media-store";
import { toast } from "sonner";

export function useDeleteMedia() {
  const { deleteMedia, isLoading } = useMediaStore();

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await deleteMedia(mediaId);

      toast.success("Media deleted", {
        description: "Media has been deleted successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Delete failed", {
        description: err.message ?? "Failed to delete media.",
      });

      return false;
    }
  };

  return {
    handleDeleteMedia,
    isDeletingMedia: isLoading,
  };
}
