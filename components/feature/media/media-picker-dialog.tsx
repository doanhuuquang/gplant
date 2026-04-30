"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/utils/helpers";
import { MediaResponse } from "@/types/media";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  LoaderCircle,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFolders } from "@/lib/hooks/use-folder";
import { useMediasByFoder, useUploadMedia } from "@/lib/hooks/use-media";
import { FolderResponse } from "@/types/folder";

interface MediaPickerDialogProps {
  open: boolean;
  selectedMediaId?: string;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: MediaResponse) => void;
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  selectedMediaId,
}: MediaPickerDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<MediaResponse | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedFolder, setSelectedFolder] = useState<FolderResponse | null>(
    null,
  );

  const { data: folders } = useFolders();
  const { data: medias, isLoading: isLoadingMedias } = useMediasByFoder(
    selectedFolder?.id ?? "",
    {
      pageNumber: pageNumber,
      pageSize: 16,
    },
  );
  const { mutate: uploadMedia, isPending: isUploadingMedia } = useUploadMedia(
    selectedFolder?.id ?? "",
  );

  useEffect(() => {
    const setDefaultFolder = () => {
      if (folders?.data && folders.data.length > 0) {
        const defaultFolder = folders.data[0];
        setSelectedFolder(defaultFolder);
      }
    };
    setDefaultFolder();
  }, [folders?.data]);

  useEffect(() => {
    const preSelectMedia = () => {
      if (
        open &&
        selectedMediaId &&
        medias?.data.items &&
        medias?.data.items.length > 0
      ) {
        const found = medias?.data.items.find((m) => m.id === selectedMediaId);
        if (found) setSelected(found);
      }
    };

    preSelectMedia();
  }, [open, selectedMediaId, medias]);

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Tệp không hợp lệ", {
        description: "Vui lòng chọn tệp hình ảnh.",
      });
      return;
    }

    uploadMedia(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onOpenChange(false);
    }
  };

  const busy = isUploadingMedia;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Chọn media</DialogTitle>
          <DialogDescription>
            Chọn ảnh có sẵn hoặc tải ảnh mới.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex items-center gap-4">
          <Select
            value={selectedFolder?.id ?? ""}
            onValueChange={(folderId) => {
              const folder = folders?.data?.find((f) => f.id === folderId);
              if (folder) setSelectedFolder(folder);
              setPageNumber(1);
            }}
          >
            <SelectTrigger className="w-full h-12! rounded-sm">
              <SelectValue placeholder="Chọn thư mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Thư mục</SelectLabel>
                {folders?.data?.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Upload button */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploadingMedia ? (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              ) : (
                <Upload className="mr-2 size-4" />
              )}
              Tải ảnh mới
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadNew}
            />
          </div>
        </div>

        {/* Media grid */}
        <div className="max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isLoadingMedias ? (
            <div className="flex items-center justify-center py-12">
              <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : medias?.data.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImagePlus className="mb-2 size-10" />
              <p className="text-sm">Không có media. Hãy tải lên ở trên.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {medias?.data.items
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

        {medias?.data && medias?.data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size={"icon"}
              disabled={!medias?.data.hasPreviousPage || busy}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              <ChevronLeft />
            </Button>
            <span className="text-sm text-muted-foreground">
              {pageNumber} / {medias.data.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={!medias?.data.hasNextPage || busy}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={!selected || busy}
            onClick={handleConfirm}
          >
            Chọn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
