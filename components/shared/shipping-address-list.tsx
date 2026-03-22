import Link from "next/link";
import ShippingAddressResponse from "@/lib/schemas/shipping-address/shipping-address-response";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { CirclePlus, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeleteShippingAddress } from "@/hooks/shipping-address/use-delete-shipping-address";

function AddressCard({
  shippingAddressResponse,
  redirectUrl,
  selectedShippingAddress,
  onSelectAddress,
}: {
  shippingAddressResponse: ShippingAddressResponse;
  redirectUrl?: string;
  selectedShippingAddress?: ShippingAddressResponse | null;
  onSelectAddress?: (address: ShippingAddressResponse) => void;
}) {
  const { handleDeleteShippingAddress, isDeletingShippingAddress } =
    useDeleteShippingAddress();

  return (
    <div
      className={cn(
        "lg:col-span-1 col-span-4 w-full h-full aspect-square border rounded-sm flex flex-col bg-background dark:bg-muted",
        selectedShippingAddress?.id === shippingAddressResponse.id &&
          "border-primary",
      )}
    >
      <div className="w-full border-b border-muted p-4 flex items-center justify-between">
        <p className="font-medium">
          {shippingAddressResponse.isPrimary ? "Primary Address" : "Address"}
        </p>
        <Link
          href={`${APP_PATHS.USER_ADDRESSES}/edit/${shippingAddressResponse.id}${redirectUrl ? `?redirect_url=${redirectUrl}` : ""}`}
          className="text-sm text-muted-foreground"
        >
          Edit
        </Link>
      </div>
      <div
        className="w-full p-4 space-y-2 grow cursor-pointer"
        onClick={() =>
          onSelectAddress && onSelectAddress(shippingAddressResponse)
        }
      >
        <p className="text-sm">{shippingAddressResponse.shippingName}</p>

        <p className="text-sm text-muted-foreground">
          {`${shippingAddressResponse.buildingName}, 
          ${shippingAddressResponse.address}`}
        </p>

        <p className="text-sm text-muted-foreground">
          {shippingAddressResponse.shippingPhone}
        </p>
      </div>
      <div className="p-4">
        <Button
          disabled={isDeletingShippingAddress}
          variant={"destructive"}
          onClick={() =>
            handleDeleteShippingAddress(shippingAddressResponse.id)
          }
        >
          {isDeletingShippingAddress && (
            <LoaderCircle className="animate-spin" />
          )}
          DELETE ADDRESS
        </Button>
      </div>
    </div>
  );
}

export default function ShippingAddressList({
  shippingAddresses,
  redirectUrl,
  colNumber = 4,
  selectedShippingAddress,
  onSelectAddress,
}: {
  shippingAddresses: ShippingAddressResponse[];
  redirectUrl?: string;
  colNumber?: number;
  selectedShippingAddress?: ShippingAddressResponse | null;
  onSelectAddress?: (address: ShippingAddressResponse) => void;
}) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${colNumber}, 1fr)`,
      }}
    >
      {shippingAddresses.map((addess) => (
        <AddressCard
          key={addess.id}
          shippingAddressResponse={addess}
          redirectUrl={redirectUrl}
          selectedShippingAddress={selectedShippingAddress}
          onSelectAddress={onSelectAddress}
        />
      ))}
      <Link
        href={`${APP_PATHS.USER_ADDRESSES}/add${redirectUrl ? `?redirect_url=${redirectUrl}` : ""}`}
        className="lg:col-span-1 col-span-4 w-full aspect-square border rounded-sm p-4 flex flex-col items-center justify-center gap-3"
      >
        <CirclePlus className="size-10 text-gray-300" />
        <p className="text-sm text-muted-foreground">Add new address</p>
      </Link>
    </div>
  );
}
