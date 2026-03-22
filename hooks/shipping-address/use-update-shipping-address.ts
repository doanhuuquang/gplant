"use client";

import UpdateAddressRequest from "@/lib/schemas/shipping-address/update-address-request";
import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { toast } from "sonner";
import { useShippingAddressStore } from "@/stores/shipping-address-store";

export function useUpdateShippingAddress() {
  const { updateShippingAddress, isUpdatingShippingAddress } =
    useShippingAddressStore();

  const handleUpdateShippingAddress = async (
    shippingAddressId: string,
    request: UpdateAddressRequest,
  ) => {
    try {
      await updateShippingAddress(shippingAddressId, request);

      toast.success("Address updated", {
        description: "Address has been updated successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Update failed", {
        description: err.message ?? "Failed to update address.",
      });

      return false;
    }
  };

  return {
    handleUpdateShippingAddress,
    isUpdatingShippingAddress,
  };
}
