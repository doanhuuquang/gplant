"use client";

import ShippingAddressList from "@/components/shared/shipping-address-list";
import { useGetShippingAddressesByUserId } from "@/hooks/shipping-address/use-get-shipping-addresses-by-userid";
import { useAuthStore } from "@/stores/auth-store";

export default function Page() {
  const { user } = useAuthStore();
  const { shippingAddresses } = useGetShippingAddressesByUserId(user?.id ?? "");

  return (
    <div>
      <ShippingAddressList
        shippingAddresses={shippingAddresses}
        colNumber={3}
      />
    </div>
  );
}
