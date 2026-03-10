"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";

export function useDeleteUser() {
  const { deleteUser, isLoading } = useUserStore();

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);

      toast.success("User deleted", {
        description: "User has been deleted successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Delete failed", {
        description: err.message ?? "Failed to delete user.",
      });

      return false;
    }
  };

  return {
    handleDeleteUser,
    isLoading,
  };
}
