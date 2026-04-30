"use client";

import { CareInstructionResponse } from "@/types/care-instruction";
import { useDeleteCareInstruction } from "@/lib/hooks/use-care-instruction";
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

interface DeleteCareInstructionDialogProps {
  open: boolean;
  careInstruction: CareInstructionResponse;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteCareInstructionDialog({
  open,
  onOpenChange,
  careInstruction,
  onSuccess,
}: DeleteCareInstructionDialogProps) {
  const { mutate: deleteCareInstruction, isPending } =
    useDeleteCareInstruction();

  const handleDeleteCareInstruction = async () => {
    deleteCareInstruction(careInstruction.id, {
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
          <AlertDialogTitle>Xóa hướng dẫn chăm sóc</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa hướng dẫn chăm sóc (
            <strong>{careInstruction.lightRequirement}</strong>)? Hành động này
            không thể hoàn tác. Hướng dẫn đã được cây sử dụng thì không thể xóa.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteCareInstruction}
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
