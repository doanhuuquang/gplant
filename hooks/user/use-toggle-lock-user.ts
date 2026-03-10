"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";

export function useToggleLockUser() {
  const { toggleLockUser, isLoading } = useUserStore();

  const handleToggleLockUser = async (id: string) => {
    try {
      await toggleLockUser(id);

      toast.success("User updated", {
        description: "User lock status has been toggled successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Toggle lock failed", {
        description: err.message ?? "Failed to toggle user lock status.",
      });

      return false;
    }
  };

  return {
    handleToggleLockUser,
    isLoading,
  };
}
