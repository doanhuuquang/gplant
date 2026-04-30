"use client";

import { FolderResponse } from "@/types/folder";
import { useDeleteFolder } from "@/lib/hooks/use-folder";
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

interface DeleteFolderDialogProps {
  open: boolean;
  folder: FolderResponse;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteFolderDialog({
  open,
  onOpenChange,
  folder,
  onSuccess,
}: DeleteFolderDialogProps) {
  const { mutate: deleteFolder, isPending } = useDeleteFolder();

  const handleDeletePlant = async () => {
    deleteFolder(folder.id, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa thư mục</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa <strong>{folder.name}</strong>? Thao tác này sẽ
            xóa tất cả hình ảnh bên trong và không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeletePlant}
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
