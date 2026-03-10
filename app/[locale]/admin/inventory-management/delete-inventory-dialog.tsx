"use client";

import InventoryResponse from "@/lib/schemas/inventory/inventory-response";
import { useDeleteInventory } from "@/hooks/inventory/use-delete-inventory";

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
  onOpenChange: (open: boolean) => void;
  inventory: InventoryResponse;
}

export function DeleteInventoryDialog({
  open,
  onOpenChange,
  inventory,
}: DeleteInventoryDialogProps) {
  const { handleDeleteInventory, isLoading } = useDeleteInventory();

  const onConfirmDelete = async () => {
    const success = await handleDeleteInventory(inventory.id);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete inventory</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the inventory for{" "}
            <strong>{inventory.plantVariant?.sku ?? inventory.id}</strong>? This
            action cannot be undone.
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
