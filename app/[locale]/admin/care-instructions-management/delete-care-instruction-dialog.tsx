"use client";

import CareInstructionResponse from "@/lib/schemas/care-instruction.ts/care-instruction-response";
import { useDeleteCareInstruction } from "@/hooks/care-instruction/use-delete-care-instruction";

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
  onOpenChange: (open: boolean) => void;
  careInstruction: CareInstructionResponse;
  onSuccess?: () => void;
}

export function DeleteCareInstructionDialog({
  open,
  onOpenChange,
  careInstruction,
  onSuccess,
}: DeleteCareInstructionDialogProps) {
  const { handleDeleteCareInstruction, isLoading } = useDeleteCareInstruction();

  const onConfirmDelete = async () => {
    const success = await handleDeleteCareInstruction(careInstruction.id);
    if (success) {
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete care instruction</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this care instruction (
            <strong>{careInstruction.lightRequirement}</strong>)? This action
            cannot be undone. Care instructions used by plants cannot be
            deleted.
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
