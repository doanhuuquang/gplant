"use client";

import { LightningSaleResponse } from "@/lib/schemas/lightning-sale/lightning-sale-response";
import { useDeleteLightningSale } from "@/hooks/lightning-sale/use-delete-lightning-sale";

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
  onOpenChange: (open: boolean) => void;
  sale: LightningSaleResponse;
  onSuccess?: () => void;
}

export function DeleteLightningSaleDialog({
  open,
  onOpenChange,
  sale,
  onSuccess,
}: DeleteLightningSaleDialogProps) {
  const { handleDeleteLightningSale, isLoading } = useDeleteLightningSale();

  const onConfirmDelete = async () => {
    const success = await handleDeleteLightningSale(sale.id);
    if (success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete lightning sale</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the lightning sale{" "}
            <strong>{sale.name}</strong>? This action cannot be undone and all
            sale items will be removed.
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
