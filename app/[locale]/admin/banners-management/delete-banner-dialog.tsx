"use client";

import BannerResponse from "@/lib/schemas/banner/banner-response";
import { useDeleteBanner } from "@/hooks/banner/use-delete-banner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: BannerResponse;
}

export function DeleteBannerDialog({
  open,
  onOpenChange,
  banner,
}: DeleteBannerDialogProps) {
  const { handleDeleteBanner, isLoading } = useDeleteBanner();

  const onConfirmDelete = async () => {
    const success = await handleDeleteBanner(banner.id);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete banner</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the banner{" "}
            <strong>{banner.title}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            disabled={isLoading}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
