"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { useUserStore } from "@/stores/user-store";
import { UpdateUserRequest } from "@/lib/schemas/user/update-user-request";
import { toast } from "sonner";

export function useUpdateUser() {
  const { updateUser, isLoading } = useUserStore();

  const handleUpdateUser = async (id: string, request: UpdateUserRequest) => {
    try {
      await updateUser(id, request);

      toast.success("User updated", {
        description: "User has been updated successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update user.",
      });

      return false;
    }
  };

  return {
    handleUpdateUser,
    isLoading,
  };
}
