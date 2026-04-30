"use client";

import { InventoryResponse } from "@/types/inventory";
import { useDeleteInventory } from "@/lib/hooks/use-inventory";
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

interface DeleteInventoryDialogProps {
  open: boolean;
  inventory: InventoryResponse;
  onOpenChange: (open: boolean) => void;
}

export function DeleteInventoryDialog({
  open,
  onOpenChange,
  inventory,
}: DeleteInventoryDialogProps) {
  const { mutate: deleteInventory, isPending } = useDeleteInventory();

  const onConfirmDelete = async () => {
    deleteInventory(inventory.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa tồn kho</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa tồn kho của{" "}
            <strong>{inventory.plantVariant?.sku ?? inventory.id}</strong>? This
            hành động không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
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
