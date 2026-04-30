import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { CirclePlus, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShippingAddressResponse } from "@/types/shipping-address";
import { useDeleteShippingAddress } from "@/lib/hooks/use-shipping-address";

function AddressCard({
  shippingAddressResponse,
  redirectUrl,
  selectedShippingAddress,
  isPending,
  onSelectAddress,
  deleteShippingAddress,
}: {
  shippingAddressResponse: ShippingAddressResponse;
  redirectUrl?: string;
  selectedShippingAddress?: ShippingAddressResponse | null;
  isPending: boolean;
  onSelectAddress?: (address: ShippingAddressResponse) => void;
  deleteShippingAddress: (id: string) => void;
}) {
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
          {shippingAddressResponse.isPrimary ? "Địa chỉ mặc định" : "Địa chỉ"}
        </p>
        <Link
          href={`${APP_PATHS.USER_ADDRESSES}/edit/${shippingAddressResponse.id}${redirectUrl ? `?redirect_url=${redirectUrl}` : ""}`}
          className="text-sm text-muted-foreground"
        >
          Chỉnh sửa
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
          disabled={isPending}
          variant={"destructive"}
          onClick={() => deleteShippingAddress(shippingAddressResponse.id)}
        >
          {isPending && <LoaderCircle className="animate-spin" />}
          XÓA ĐỊA CHỈ
        </Button>
      </div>
    </div>
  );
}

export default function ShippingAddressList({
  userId,
  shippingAddresses,
  redirectUrl,
  colNumber = 4,
  selectedShippingAddress,
  onSelectAddress,
}: {
  userId: string;
  shippingAddresses: ShippingAddressResponse[];
  redirectUrl?: string;
  colNumber?: number;
  selectedShippingAddress?: ShippingAddressResponse | null;
  onSelectAddress?: (address: ShippingAddressResponse) => void;
}) {
  const { mutate: deleteShippingAddress, isPending } =
    useDeleteShippingAddress(userId);

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
          deleteShippingAddress={deleteShippingAddress}
          isPending={isPending}
        />
      ))}
      <Link
        href={`${APP_PATHS.USER_ADDRESSES}/add${redirectUrl ? `?redirect_url=${redirectUrl}` : ""}`}
        className="lg:col-span-1 col-span-4 w-full aspect-square border rounded-sm p-4 flex flex-col items-center justify-center gap-3"
      >
        <CirclePlus className="size-10 text-gray-300" />
        <p className="text-sm text-muted-foreground">Thêm địa chỉ mới</p>
      </Link>
    </div>
  );
}
