"use client";

import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { UpdateUserRequest } from "@/lib/schemas/user/update-user-request";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export function useUpdateProfile() {
  const { updateProfile, isUpdatingProfile } = useAuthStore();

  const handleUpdateProfile = async (request: UpdateUserRequest) => {
    try {
      await updateProfile(request);

      toast.success("Profile updated", {
        description: "Your profile information has been updated successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description:
          err.message ?? "Unable to update your profile. Please try again.",
      });

      return false;
    }
  };

  return {
    handleUpdateProfile,
    isUpdatingProfile,
  };
}
