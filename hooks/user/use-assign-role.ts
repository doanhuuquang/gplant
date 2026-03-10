"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";

export function useAssignRole() {
  const { assignRole, isLoading } = useUserStore();

  const handleAssignRole = async (userId: string, roleName: string) => {
    try {
      await assignRole(userId, roleName);

      toast.success("Role assigned", {
        description: `Role "${roleName}" has been assigned successfully.`,
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Assign role failed", {
        description: err.message ?? "Failed to assign role.",
      });

      return false;
    }
  };

  return {
    handleAssignRole,
    isLoading,
  };
}
