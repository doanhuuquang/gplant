"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, Upload, X } from "lucide-react";
import { useUploadMedia } from "@/lib/hooks/use-media";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UploadMediaDialog({
  folderId,
  open,
  onOpenChange,
}: {
  folderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { mutate: uploadMedia, isPending } = useUploadMedia(folderId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    if (selected.type.startsWith("image/")) {
      const url = URL.createObjectURL(selected);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    handleRemoveFile();
  };

  const handleSubmit = async () => {
    if (!file) return;

    uploadMedia(file, {
      onSuccess: () => {
        handleReset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) handleReset();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tải lên media</DialogTitle>
          <DialogDescription>
            Chọn tệp để tải lên thư viện media.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="file-upload">Tệp</Label>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileChange}
              disabled={isPending}
            />
          </div>

          {file && (
            <div className="flex items-center gap-3 rounded-sm border p-3">
              {preview ? (
                <Image
                  src={preview}
                  alt={file.name}
                  width={64}
                  height={64}
                  className="size-16 rounded-sm object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-sm bg-muted">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {file.size < 1024 * 1024
                    ? `${(file.size / 1024).toFixed(2)} KB`
                    : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                disabled={isPending}
              >
                <X className="size-4" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild disabled={isPending}>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!file || isPending}>
            {isPending && <LoaderCircle className="animate-spin" />}
            Tải lên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
