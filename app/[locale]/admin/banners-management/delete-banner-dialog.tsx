"use client";

import { BannerResponse } from "@/types/banner";
import { useDeleteBanner } from "@/lib/hooks/use-banner";
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
  banner: BannerResponse;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBannerDialog({
  open,
  onOpenChange,
  banner,
}: DeleteBannerDialogProps) {
  const { mutate: deleteBanner, isPending } = useDeleteBanner();

  const handleDelete = () =>
    deleteBanner(banner.id, {
      onSuccess: () => onOpenChange(false),
    });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa banner</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa banner
            <strong>{banner.title}</strong>? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete()}
            disabled={isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
