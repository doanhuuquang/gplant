"use client";

import ShippingAddressList from "@/components/feature/shipping-address/shipping-address-list";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { ShippingAddressResponse } from "@/types/shipping-address";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useShippingAddresses } from "@/lib/hooks/use-shipping-address";

export default function Page() {
  const router = useRouter();

  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<ShippingAddressResponse | null>(null);

  const { user } = useAuthStore();
  const { data: shippingAddresses } = useShippingAddresses(user?.id ?? "");

  useEffect(() => {
    const setDefaultShippingAddress = () => {
      if (shippingAddresses?.data.length === 0) return;

      const primaryAddress = shippingAddresses?.data.find(
        (address) => address.isPrimary,
      );

      if (primaryAddress) setSelectedShippingAddress(primaryAddress);
    };

    setDefaultShippingAddress();
  }, [shippingAddresses, setSelectedShippingAddress]);

  return (
    <main className="w-full max-w-350 mx-auto px-4 space-y-5">
      <p className="text-xl font-semibold">Địa chỉ giao hàng</p>
      <ShippingAddressList
        userId={user?.id ?? ""}
        shippingAddresses={shippingAddresses?.data || []}
        redirectUrl={APP_PATHS.SHOP_SHIPPING}
        selectedShippingAddress={selectedShippingAddress}
        onSelectAddress={setSelectedShippingAddress}
      />
      <div className="w-full flex justify-end">
        <Button
          disabled={!selectedShippingAddress}
          onClick={() => {
            if (!selectedShippingAddress) return;
            router.push(
              `${APP_PATHS.SHOP_REVIEW}?shipping-address-id=${selectedShippingAddress.id}`,
            );
          }}
        >
          TIẾP TỤC <MoveRight />
        </Button>
      </div>
    </main>
  );
}
