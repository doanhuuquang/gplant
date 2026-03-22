"use client";

import CreateAddressRequest from "@/lib/schemas/shipping-address/create-address-request";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { toast } from "sonner";
import { useShippingAddressStore } from "@/stores/shipping-address-store";

export function useCreateShippingAddress() {
  const { createShippingAddress, isAddingShippingAddress } =
    useShippingAddressStore();

  const handleCreateShippingAddress = async (
    userId: string,
    request: CreateAddressRequest,
  ) => {
    try {
      await createShippingAddress(userId, request);

      toast.success("Address created", {
        description: "Address has been created successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Create failed", {
        description: err.message ?? "Failed to create address.",
      });

      return false;
    }
  };

  return {
    handleCreateShippingAddress,
    isAddingShippingAddress,
  };
}
