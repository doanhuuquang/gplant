"use client";

import ShippingAddressList from "@/components/feature/shipping-address/shipping-address-list";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useShippingAddresses } from "@/lib/hooks/use-shipping-address";

export default function Page() {
  const { user } = useAuthStore();
  const { data } = useShippingAddresses(user?.id ?? "");

  return (
    <div>
      <ShippingAddressList
        userId={user?.id ?? ""}
        shippingAddresses={data?.data ?? []}
        colNumber={3}
      />
    </div>
  );
}
