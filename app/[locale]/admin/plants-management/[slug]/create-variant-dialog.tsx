"use client";

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
import { useCreatePlantVariant } from "@/hooks/plant/use-create-plant-variant";

const createVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  price: z.number().positive("Price must be greater than 0"),
  size: z.number().positive("Size must be greater than 0"),
  isActive: z.boolean(),
});

type CreateVariantFormValues = z.infer<typeof createVariantSchema>;

interface CreateVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plantId: string;
  onSuccess?: () => void;
}

export function CreateVariantDialog({
  open,
  onOpenChange,
  plantId,
  onSuccess,
}: CreateVariantDialogProps) {
  const { handleCreateVariant, isLoading } = useCreatePlantVariant();

  const form = useForm<CreateVariantFormValues>({
    resolver: zodResolver(createVariantSchema),
    defaultValues: {
      sku: "",
      price: 0,
      size: 0,
      isActive: true,
    },
  });

  async function onSubmit(values: CreateVariantFormValues) {
    const success = await handleCreateVariant({
      plantId,
      sku: values.sku,
      price: values.price,
      size: values.size,
      isActive: values.isActive,
    });

    if (success) {
      form.reset();
      onSuccess?.();
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Variant</DialogTitle>
          <DialogDescription>
            Add a new variant for this plant.
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
