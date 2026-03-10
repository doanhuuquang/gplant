"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";

export function useRemoveRole() {
  const { removeRole, isLoading } = useUserStore();

  const handleRemoveRole = async (userId: string, roleName: string) => {
    try {
      await removeRole(userId, roleName);

      toast.success("Role removed", {
        description: `Role "${roleName}" has been removed successfully.`,
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Remove role failed", {
        description: err.message ?? "Failed to remove role.",
      });

      return false;
    }
  };

  return {
    handleRemoveRole,
    isLoading,
  };
}
