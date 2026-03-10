"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Check, ImagePlus, LoaderCircle, Upload } from "lucide-react";
import Image from "next/image";
import { getFileUrl } from "@/utils/helpers";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaStore } from "@/stores/media-store";
import MediaResponse from "@/lib/schemas/media/media-response";
import { uploadMedia as uploadMediaApi } from "@/services/media-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: MediaResponse) => void;
  selectedMediaId?: string;
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  selectedMediaId,
}: MediaPickerDialogProps) {
  const {
    medias,
    isLoading,
    hasNextPage,
    hasPreviousPage,
    pageNumber,
    totalPages,
    fetchMedias,
    setPageNumber,
  } = useMediaStore();

  const [selected, setSelected] = useState<MediaResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedias = useCallback(() => {
    fetchMedias();
  }, [fetchMedias]);

  useEffect(() => {
    if (open) {
      loadMedias();
    }
  }, [open, loadMedias, pageNumber]);

  // Pre-select current media when opening
  useEffect(() => {
    if (open && selectedMediaId && medias.length > 0) {
      const found = medias.find((m) => m.id === selectedMediaId);
      if (found) setSelected(found);
    }
  }, [open, selectedMediaId, medias]);

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", {
        description: "Please select an image file.",
      });
      return;
    }

    try {
      setIsUploading(true);
      const response = await uploadMediaApi(file);
      const media = response.data as MediaResponse;
      toast.success("Upload successful", {
        description: "Image has been uploaded.",
      });
      // Refresh media list and auto-select the new one
      await fetchMedias();
      setSelected(media);
    } catch {
      toast.error("Upload failed", {
        description: "Failed to upload image.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onOpenChange(false);
    }
  };

  const busy = isLoading || isUploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
          <DialogDescription>
            Choose an existing image or upload a new one.
          </DialogDescription>
        </DialogHeader>

        {/* Upload button */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            ) : (
              <Upload className="mr-2 size-4" />
            )}
            Upload new image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadNew}
          />
        </div>

        {/* Media grid */}
        <div className="max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isLoading && medias.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : medias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImagePlus className="mb-2 size-10" />
              <p className="text-sm">No media found. Upload one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {medias
                .filter((m) => m.mimeType?.startsWith("image/"))
                .map((media) => {
                  const isSelected = selected?.id === media.id;
                  return (
                    <button
                      key={media.id}
                      type="button"
                      disabled={busy}
                      onClick={() => setSelected(media)}
                      className={cn(
                        "relative aspect-square overflow-hidden rounded-md border-2 transition-all hover:opacity-90",
                        isSelected
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-transparent hover:border-muted-foreground/30",
                      )}
                    >
                      <Image
                        src={getFileUrl(media.fileUrl)}
                        alt={media.fileName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Check className="size-6 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPreviousPage || busy}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {pageNumber} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage || busy}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Next
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!selected || busy}
            onClick={handleConfirm}
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
