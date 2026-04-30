"use client";

import { PlantResponse } from "@/types/plant";
import { useDeletePlant } from "@/lib/hooks/use-plant";
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
  plant: PlantResponse;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeletePlantDialog({
  open,
  onOpenChange,
  plant,
  onSuccess,
}: DeletePlantDialogProps) {
  const { mutate: deletePlant, isPending } = useDeletePlant();

  const handleDeletePlant = async () => {
    deletePlant(plant.id, {
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
          <AlertDialogTitle>Xóa cây</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa <strong>{plant.name}</strong>? Thao tác này sẽ
            xóa toàn bộ biến thể và hình ảnh, và không thể hoàn tác.
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
