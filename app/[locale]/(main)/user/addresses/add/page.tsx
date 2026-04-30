"use client";

import Mapbox from "@/components/feature/address/mapbox";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateShippingAddressRequest } from "@/types/shipping-address";
import { CreateShippingAddressRequestValidation } from "@/validations/shipping-address";
import { Input } from "@/components/ui/input";
import { LoaderCircle, MoveRight } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCreateShippingAddress } from "@/lib/hooks/use-shipping-address";
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

export default function Page() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const router = useRouter();

  const [isMapStep, setIsMapStep] = useState<boolean>(true);
  const [address, setAddress] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");

  const { user } = useAuthStore();
  const { mutate: createShippingAddress, isPending } = useCreateShippingAddress(
    user?.id ?? "",
  );

  const handleAddressChange = (
    newAddress: string,
    longitude: string,
    latitude: string,
  ) => {
    setAddress(newAddress);
    setLongitude(longitude);
    setLatitude(latitude);

    form.setValue("address", newAddress, { shouldDirty: true });
    form.setValue("longitude", longitude, { shouldDirty: true });
    form.setValue("latitude", latitude, { shouldDirty: true });
  };

  const form = useForm<CreateShippingAddressRequest>({
    resolver: zodResolver(CreateShippingAddressRequestValidation),
    defaultValues: {
      shippingName: "",
      shippingPhone: "",
      address: "",
      buildingName: "",
      isPrimary: false,
      longitude: "",
      latitude: "",
    },
  });

  function onSubmit(data: CreateShippingAddressRequest) {
    if (!address || !user) return;

    const request: CreateShippingAddressRequest = {
      shippingName: data.shippingName,
      shippingPhone: data.shippingPhone,
      buildingName: data.buildingName,
      address: address!,
      isPrimary: data.isPrimary === true,
      longitude: longitude,
      latitude: latitude,
    };

    createShippingAddress(request, {
      onSuccess: () => router.push(redirectUrl ?? APP_PATHS.USER_ADDRESSES),
    });
  }

  return (
    <div>
      {/* Map */}
      {isMapStep && (
        <div className="w-full border rounded-sm">
          <p className="p-4 font-semibold">Thêm địa chỉ mới</p>
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
              XÁC NHẬN VỊ TRÍ <MoveRight />
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
              <p className="text-lg font-semibold">Thêm địa chỉ mới</p>
              <FormField
                control={form.control}
                name="isPrimary"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="font-normal text-sm">
                      Đặt làm địa chỉ mặc định
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
                <p className="font-semibold">Vị trí từ bản đồ</p>
                <div className="w-full flex gap-4">
                  <div className="w-1/2 h-auto aspect-square bg-muted relative">
                    <Button
                      variant={"secondary"}
                      className="w-full rounded-none absolute bottom-0 left-0"
                      onClick={() => setIsMapStep(true)}
                    >
                      Chỉnh sửa
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
                          placeholder="Số căn hộ, tên tòa nhà"
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
                          placeholder="Tên người nhận"
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
                          placeholder="Số điện thoại người nhận"
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
                  Lưu địa chỉ mới
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
