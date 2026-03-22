"use client";

import ShippingAddressList from "@/components/shared/shipping-address-list";
import ShippingAddressResponse from "@/lib/schemas/shipping-address/shipping-address-response";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect, useState } from "react";
import { useGetShippingAddressesByUserId } from "@/hooks/shipping-address/use-get-shipping-addresses-by-userid";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { shippingAddresses } = useGetShippingAddressesByUserId(user?.id ?? "");

  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<ShippingAddressResponse | null>(null);

  useEffect(() => {
    const setDefaultShippingAddress = () => {
      if (shippingAddresses.length === 0) return;

      const primaryAddress = shippingAddresses.find(
        (address) => address.isPrimary,
      );

      if (primaryAddress) setSelectedShippingAddress(primaryAddress);
    };

    setDefaultShippingAddress();
  }, [shippingAddresses, setSelectedShippingAddress]);

  return (
    <main className="w-full max-w-350 mx-auto px-4 space-y-5">
      <p className="text-xl font-semibold">Shipping address</p>
      <ShippingAddressList
        shippingAddresses={shippingAddresses}
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
          CONTINUE <MoveRight />
        </Button>
      </div>
    </main>
  );
}
