"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { PlantVariantResponse } from "@/types/plant";
import { Switch } from "@/components/ui/switch";
import { UpdatePlantVariantRequestValidation } from "@/validations/plant";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUpdatePlantVariant } from "@/lib/hooks/use-plant";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type EditVariantFormValues = z.infer<
  typeof UpdatePlantVariantRequestValidation
>;

interface EditVariantDialogProps {
  open: boolean;
  variant: PlantVariantResponse;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditVariantDialog({
  open,
  onOpenChange,
  variant,
  onSuccess,
}: EditVariantDialogProps) {
  const [prevVariant, setPrevVariant] = useState(variant);

  const { mutate: updatePlantVariant, isPending } = useUpdatePlantVariant();

  const form = useForm<EditVariantFormValues>({
    resolver: zodResolver(UpdatePlantVariantRequestValidation),
    defaultValues: {
      sku: variant.sku,
      price: variant.price,
      size: variant.size,
      isActive: variant.isActive,
    },
  });

  if (variant !== prevVariant) {
    setPrevVariant(variant);
    form.reset({
      sku: variant.sku,
      price: variant.price,
      size: variant.size,
      isActive: variant.isActive,
    });
  }

  async function onSubmit(values: EditVariantFormValues) {
    const request = {
      sku: values.sku,
      price: values.price,
      size: values.size,
      isActive: values.isActive,
    };

    updatePlantVariant(
      { id: variant.id, request: request },
      {
        onSuccess: () => {
          onSuccess?.();
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa biến thể</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin biến thể bên dưới.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sku"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: PLT-001-S" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VND)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kích thước (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-sm border p-3">
                  <FormLabel className="cursor-pointer">Kích hoạt</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                )}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
