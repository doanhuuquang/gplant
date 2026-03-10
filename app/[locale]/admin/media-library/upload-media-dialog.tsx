"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUploadMedia } from "@/hooks/media/use-upload-media";

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
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { handleUploadMedia, isUploading } = useUploadMedia();
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

    const success = await handleUploadMedia(file);
    if (success) {
      toast.success("Upload successful", {
        description: `"${file.name}" has been uploaded.`,
      });
      handleReset();
      setOpen(false);
    } else {
      toast.error("Upload failed", {
        description: "Something went wrong. Please try again.",
      });
    }
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
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Select a file to upload to the media library.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="file-upload">File</Label>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileChange}
              disabled={isUploading}
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
                disabled={isUploading}
              >
                <X className="size-4" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild disabled={isUploading}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!file || isUploading}>
            {isUploading && <LoaderCircle className="animate-spin" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
