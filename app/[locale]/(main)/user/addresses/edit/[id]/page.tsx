"use client";

import Mapbox from "@/components/shared/mapbox";
import ShippingAddressResponse from "@/lib/schemas/shipping-address/shipping-address-response";
import UpdateAddressRequest from "@/lib/schemas/shipping-address/update-address-request";
import z from "zod";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { LoaderCircle, MoveRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useShippingAddressStore } from "@/stores/shipping-address-store";
import { useUpdateShippingAddress } from "@/hooks/shipping-address/use-update-shipping-address";
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
  shippingPhone: z
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
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { handleUpdateShippingAddress, isUpdatingShippingAddress } =
    useUpdateShippingAddress();
  const { user } = useAuthStore();
  const { shippingAddresses, fetchShippingAddresses } =
    useShippingAddressStore();

  useEffect(() => {
    if (user && shippingAddresses.length === 0) {
      fetchShippingAddresses(user.id);
    }
  }, [user, shippingAddresses.length, fetchShippingAddresses]);

  const [isMapStep, setIsMapStep] = useState<boolean>(true);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddressResponse | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");

  const form = useForm<z.infer<typeof formShippingAddressSchema>>({
    resolver: zodResolver(formShippingAddressSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!id || shippingAddresses.length === 0) return;

    const getShippingAddress = () => {
      const address = shippingAddresses.find((address) => address.id === id);
      if (!address) {
        router.push(APP_PATHS.USER_ADDRESSES);
        return;
      }
      setShippingAddress(address);
    };

    getShippingAddress();
  }, [id, router, shippingAddresses]);

  useEffect(() => {
    const setValueToForm = () => {
      if (shippingAddress) {
        form.setValue("buildingName", shippingAddress.buildingName);
        form.setValue("shippingName", shippingAddress.shippingName);
        form.setValue("shippingPhone", shippingAddress.shippingPhone);
        form.setValue("isPrimary", shippingAddress.isPrimary || false);
        setAddress(shippingAddress.address);
        setLongitude(shippingAddress.longitude);
        setLatitude(shippingAddress.latitude);
      }
    };

    setValueToForm();
  }, [shippingAddress, form]);

  const handleAddressChange = (
    newAddress: string,
    longitude: string,
    latitude: string,
  ) => {
    setAddress(newAddress);
    setLongitude(longitude);
    setLatitude(latitude);
  };

  function onSubmit(data: z.infer<typeof formShippingAddressSchema>) {
    if (!shippingAddress || !address) return;

    const request: UpdateAddressRequest = {
      shippingName: data.shippingName,
      shippingPhone: data.shippingPhone,
      buildingName: data.buildingName,
      address: address,
      isPrimary: data.isPrimary === true,
      longitude: longitude,
      latitude: latitude,
    };

    handleUpdateShippingAddress(shippingAddress.id, request);

    router.push(redirectUrl ?? APP_PATHS.USER_ADDRESSES);
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
      {!isMapStep && (
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
                disabled={isUpdatingShippingAddress}
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
                  disabled={isUpdatingShippingAddress}
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
                  disabled={isUpdatingShippingAddress}
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
                  disabled={isUpdatingShippingAddress}
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
                  disabled={isUpdatingShippingAddress}
                >
                  {isUpdatingShippingAddress && (
                    <LoaderCircle className="animate-spin" />
                  )}
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
