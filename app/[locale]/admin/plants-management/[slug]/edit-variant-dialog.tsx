"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUpdatePlantVariant } from "@/hooks/plant/use-update-plant-variant";
import { PlantVariantResponse } from "@/lib/schemas/plant/plant-variant-response";

const editVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  price: z.number().positive("Price must be greater than 0"),
  size: z.number().positive("Size must be greater than 0"),
  isActive: z.boolean(),
});

type EditVariantFormValues = z.infer<typeof editVariantSchema>;

interface EditVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: PlantVariantResponse;
  onSuccess?: () => void;
}

export function EditVariantDialog({
  open,
  onOpenChange,
  variant,
  onSuccess,
}: EditVariantDialogProps) {
  const { handleUpdateVariant, isLoading } = useUpdatePlantVariant();

  const form = useForm<EditVariantFormValues>({
    resolver: zodResolver(editVariantSchema),
    defaultValues: {
      sku: variant.sku,
      price: variant.price,
      size: variant.size,
      isActive: variant.isActive,
    },
  });

  // Sync form when variant prop changes
  const [prevVariant, setPrevVariant] = useState(variant);
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
    const success = await handleUpdateVariant(variant.id, {
      sku: values.sku,
      price: values.price,
      size: values.size,
      isActive: values.isActive,
    });

    if (success) {
      onSuccess?.();
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
          <DialogDescription>
            Update the variant details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sku"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. PLT-001-S" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (VND)</FormLabel>
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
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (cm)</FormLabel>
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
                  <FormLabel className="cursor-pointer">Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
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
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
