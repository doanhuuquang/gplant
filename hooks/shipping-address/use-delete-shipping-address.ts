"use client";

import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { toast } from "sonner";
import { useShippingAddressStore } from "@/stores/shipping-address-store";

export function useDeleteShippingAddress() {
  const { deleteShippingAddress, isDeletingShippingAddress } =
    useShippingAddressStore();

  const handleDeleteShippingAddress = async (shippingAddressId: string) => {
    try {
      await deleteShippingAddress(shippingAddressId);

      toast.success("Address Deleted", {
        description: "Address has been deleted successfully.",
      });

      return true;
    } catch (e) {
      const err = e as ApiErrorResponse;
      toast.error("Delete failed", {
        description: err.message ?? "Failed to delete address.",
      });

      return false;
    }
  };

  return {
    handleDeleteShippingAddress,
    isDeletingShippingAddress,
  };
}
