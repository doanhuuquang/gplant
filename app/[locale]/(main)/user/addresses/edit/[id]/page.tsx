"use client";

import Mapbox from "@/components/feature/address/mapbox";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { LoaderCircle, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UpdateShippingAddressRequest } from "@/types/shipping-address";
import { UpdateShippingAddressRequestValidation } from "@/validations/shipping-address";
import {
  useShippingAddresses,
  useUpdateShippingAddress,
} from "@/lib/hooks/use-shipping-address";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function Page() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const router = useRouter();

  const [isMapStep, setIsMapStep] = useState<boolean>(true);
  const [address, setAddress] = useState<string | null>(null); // chỉ giữ address để hiển thị ngoài form

  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { mutate: updateShippingAddress, isPending } = useUpdateShippingAddress(
    user?.id ?? "",
  );
  const { data } = useShippingAddresses(user?.id ?? "");

  const shippingAddress = data?.data.find((addr) => addr.id === id);

  const form = useForm<UpdateShippingAddressRequest>({
    resolver: zodResolver(UpdateShippingAddressRequestValidation),
    defaultValues: shippingAddress
      ? {
          buildingName: shippingAddress.buildingName,
          shippingName: shippingAddress.shippingName,
          shippingPhone: shippingAddress.shippingPhone,
          isPrimary: shippingAddress.isPrimary || false,
          address: shippingAddress.address,
          longitude: shippingAddress.longitude,
          latitude: shippingAddress.latitude,
        }
      : {},
  });

  useEffect(() => {
    const setAddressFromShippingAddress = () => {
      if (shippingAddress) {
        form.reset({
          buildingName: shippingAddress.buildingName,
          shippingName: shippingAddress.shippingName,
          shippingPhone: shippingAddress.shippingPhone,
          isPrimary: shippingAddress.isPrimary || false,
          address: shippingAddress.address,
          longitude: shippingAddress.longitude,
          latitude: shippingAddress.latitude,
        });
        setAddress(shippingAddress.address);
      }
    };

    setAddressFromShippingAddress();
  }, [shippingAddress, form]);

  const handleAddressChange = (
    newAddress: string,
    longitude: string,
    latitude: string,
  ) => {
    setAddress(newAddress);
    form.setValue("address", newAddress);
    form.setValue("longitude", longitude);
    form.setValue("latitude", latitude);
  };

  function onSubmit(data: UpdateShippingAddressRequest) {
    updateShippingAddress(
      {
        shippingAddressId: id,
        request: {
          ...data,
          isPrimary: data.isPrimary === true,
        },
      },
      {
        onSuccess: () => router.push(redirectUrl ?? APP_PATHS.USER_ADDRESSES),
      },
    );
  }

  return (
    <div>
      {/* Map */}
      {isMapStep && shippingAddress && (
        <div className="w-full border rounded-sm">
          <p className="p-4 font-semibold">Edit address</p>
          <Mapbox
            height={500}
            onAddressChange={handleAddressChange}
            defaultLng={Number(shippingAddress?.longitude)}
            defaultLat={Number(shippingAddress?.latitude)}
          />
          <div className="w-full p-4 flex justify-end items-center flex-wrap gap-4">
            <p className="text-sm">{address}</p>
            <div className="grow"></div>
            <Button
              disabled={!address}
              className="rounded-none"
              onClick={() => {
                if (!address) return;
                setIsMapStep(false);
              }}
            >
              CONFIRM LOCATION <MoveRight />
            </Button>
          </div>
        </div>
      )}

      {/* Form */}
      {!isMapStep && shippingAddress && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <div className="w-full flex items-center justify-between border p-4 rounded-sm">
              <p className="text-lg font-semibold">Edit address</p>
              <FormField
                control={form.control}
                name="isPrimary"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="font-normal text-sm">
                      Set as default address
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => field.onChange(!field.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full grid lg:grid-cols-2 gap-4">
              <div className="w-full border p-4 rounded-sm space-y-4">
                <p className="font-semibold">Location from map</p>
                <div className="w-full flex gap-4">
                  <div className="w-1/2 h-auto aspect-square bg-muted relative">
                    <Button
                      variant={"secondary"}
                      className="w-full rounded-none absolute bottom-0 left-0"
                      onClick={() => setIsMapStep(true)}
                    >
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm">{address}</p>
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="buildingName"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Apartment No, Flat Name, Tower No. Buildning name"
                          {...field}
                          className="rounded-none border-t-0 border-l-0 border-r-0 border-b border-border shadow-none px-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingName"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Shipping name"
                          {...field}
                          className="rounded-none border-t-0 border-l-0 border-r-0 border-b border-border shadow-none px-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingPhone"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Shipping phone"
                          {...field}
                          className="rounded-none border-t-0 border-l-0 border-r-0 border-b border-border shadow-none px-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && <LoaderCircle className="animate-spin" />}
                  Save address
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
