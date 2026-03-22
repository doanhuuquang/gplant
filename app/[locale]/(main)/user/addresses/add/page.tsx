"use client";

import CreateAddressRequest from "@/lib/schemas/shipping-address/create-address-request";
import Mapbox from "@/components/shared/mapbox";
import z from "zod";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { LoaderCircle, MoveRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useCreateShippingAddress } from "@/hooks/shipping-address/use-create-shipping-address";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formShippingAddressSchema = z.object({
  shippingName: z
    .string()
    .min(1, "Shipping name is required")
    .max(30, "Shipping name is too long"),
  ShippingPhone: z
    .string()
    .min(1, "Shipping phone is required")
    .max(10, "Shipping phone is invalid")
    .regex(/^0\d{9}$/, "Shipping phone is invalid"),
  buildingName: z
    .string()
    .min(1, "Building name is required")
    .max(100, "Building name is too long"),
  isPrimary: z.boolean().optional(),
});

export default function Page() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const router = useRouter();

  const { handleCreateShippingAddress, isAddingShippingAddress } =
    useCreateShippingAddress();
  const { user } = useAuthStore();

  const [isMapStep, setIsMapStep] = useState<boolean>(true);
  const [address, setAddress] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");

  const handleAddressChange = (
    newAddress: string,
    longitude: string,
    latitude: string,
  ) => {
    setAddress(newAddress);
    setLongitude(longitude);
    setLatitude(latitude);
  };

  const form = useForm<z.infer<typeof formShippingAddressSchema>>({
    resolver: zodResolver(formShippingAddressSchema),
    defaultValues: {
      shippingName: "",
      ShippingPhone: "",
      buildingName: "",
      isPrimary: false,
    },
  });

  function onSubmit(data: z.infer<typeof formShippingAddressSchema>) {
    if (!address || !user) return;

    const request: CreateAddressRequest = {
      shippingName: data.shippingName,
      shippingPhone: data.ShippingPhone,
      buildingName: data.buildingName,
      address: address!,
      isPrimary: data.isPrimary === true,
      longitude: longitude,
      latitude: latitude,
    };

    handleCreateShippingAddress(user.id, request);

    router.push(redirectUrl ?? APP_PATHS.USER_ADDRESSES);
  }

  return (
    <div>
      {/* Map */}
      {isMapStep && (
        <div className="w-full border rounded-sm">
          <p className="p-4 font-semibold">Add new address</p>
          <Mapbox height={500} onAddressChange={handleAddressChange} />
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
      {!isMapStep && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <div className="w-full flex items-center justify-between border p-4 rounded-sm">
              <p className="text-lg font-semibold">Add new address</p>
              <FormField
                control={form.control}
                name="isPrimary"
                disabled={isAddingShippingAddress}
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
                  disabled={isAddingShippingAddress}
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
                  disabled={isAddingShippingAddress}
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
                  name="ShippingPhone"
                  disabled={isAddingShippingAddress}
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAddingShippingAddress}
                >
                  {isAddingShippingAddress && (
                    <LoaderCircle className="animate-spin" />
                  )}
                  Save new address
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
