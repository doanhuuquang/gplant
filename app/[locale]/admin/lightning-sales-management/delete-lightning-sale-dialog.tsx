"use client";

import { LightningSaleResponse } from "@/types/lightning-sale";
import { useDeleteLightningSale } from "@/lib/hooks/use-lightning-sale";
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

interface DeleteLightningSaleDialogProps {
  open: boolean;
  sale: LightningSaleResponse;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteLightningSaleDialog({
  open,
  onOpenChange,
  sale,
  onSuccess,
}: DeleteLightningSaleDialogProps) {
  const { mutate: deleteLightningSale, isPending } = useDeleteLightningSale();

  const handleDeleteLightningSale = async () => {
    deleteLightningSale(sale.id, {
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
          <AlertDialogTitle>Xóa lightning sale</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa lightning sale <strong>{sale.name}</strong>?
            Hành động này không thể hoàn tác và toàn bộ sản phẩm khuyến mãi sẽ
            bị xóa.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteLightningSale}
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
