"use client";

import PlantResponse from "@/lib/schemas/plant/plant-response";
import { useDeletePlant } from "@/hooks/plant/use-delete-plant";

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

interface DeletePlantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plant: PlantResponse;
  onSuccess?: () => void;
}

export function DeletePlantDialog({
  open,
  onOpenChange,
  plant,
  onSuccess,
}: DeletePlantDialogProps) {
  const { handleDeletePlant, isLoading } = useDeletePlant();

  const onConfirmDelete = async () => {
    const success = await handleDeletePlant(plant.id);
    if (success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete plant</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{plant.name}</strong>? This
            will also delete all variants and images. This action cannot be
            undone.
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
