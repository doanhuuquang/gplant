"use client";

import { Button } from "@/components/ui/button";
import { CreatePlantVariantRequestValidation } from "@/validations/plant";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useCreatePlantVariant } from "@/lib/hooks/use-plant";
import { useForm } from "react-hook-form";
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

type CreateVariantFormValues = z.infer<
  typeof CreatePlantVariantRequestValidation
>;

interface CreateVariantDialogProps {
  open: boolean;
  plantId: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateVariantDialog({
  open,
  onOpenChange,
  plantId,
  onSuccess,
}: CreateVariantDialogProps) {
  const { mutate: createPlantVariant, isPending } = useCreatePlantVariant();

  const form = useForm<CreateVariantFormValues>({
    resolver: zodResolver(CreatePlantVariantRequestValidation),
    defaultValues: {
      plantId: plantId,
      sku: "",
      price: 0,
      size: 0,
      isActive: true,
    },
  });

  async function onSubmit(values: CreateVariantFormValues) {
    const request = {
      plantId: values.plantId,
      sku: values.sku,
      price: values.price,
      size: values.size,
      isActive: values.isActive,
    };

    createPlantVariant(request, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo biến thể</DialogTitle>
          <DialogDescription>Thêm biến thể mới cho cây này.</DialogDescription>
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
                Tạo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
