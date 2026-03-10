"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useMediaStore } from "@/stores/media-store";
import { toast } from "sonner";

export function useUploadMedia() {
  const { uploadMedia, isLoading } = useMediaStore();

  const handleUploadMedia = async (file: File) => {
    try {
      await uploadMedia(file);

      toast.success("Media uploaded", {
        description: "Media has been uploaded successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Upload failed", {
        description: err.message ?? "Failed to upload media.",
      });

      return false;
    }
  };

  return {
    handleUploadMedia,
    isUploading: isLoading,
  };
}
