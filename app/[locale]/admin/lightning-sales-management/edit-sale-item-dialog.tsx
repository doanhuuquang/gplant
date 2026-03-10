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
import { useUpdateSaleItem } from "@/hooks/lightning-sale/use-update-sale-item";
import { LightningSaleItemResponse } from "@/lib/schemas/lightning-sale/lightning-sale-item-response";

const editSaleItemSchema = z.object({
  salePrice: z.number().positive("Sale price must be greater than 0"),
  quantityLimit: z
    .number()
    .int()
    .positive("Quantity limit must be greater than 0"),
  isActive: z.boolean(),
});

type EditSaleItemFormValues = z.infer<typeof editSaleItemSchema>;

interface EditSaleItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: LightningSaleItemResponse;
}

export function EditSaleItemDialog({
  open,
  onOpenChange,
  item,
}: EditSaleItemDialogProps) {
  const { handleUpdateSaleItem, isLoading } = useUpdateSaleItem();

  const form = useForm<EditSaleItemFormValues>({
    resolver: zodResolver(editSaleItemSchema),
    defaultValues: {
      salePrice: item.salePrice,
      quantityLimit: item.quantityLimit,
      isActive: item.isActive,
    },
  });

  async function onSubmit(values: EditSaleItemFormValues) {
    const success = await handleUpdateSaleItem(item.id, {
      salePrice: values.salePrice,
      quantityLimit: values.quantityLimit,
      isActive: values.isActive,
    });

    if (success) {
      onOpenChange(false);
    }
  }

  const busy = isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Sale Item</DialogTitle>
          <DialogDescription>
            Update the sale item details. Original price:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(item.originalPrice)}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="salePrice"
              disabled={busy}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Price (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter sale price"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? 0 : Number(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantityLimit"
              disabled={busy}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quantity Limit (sold: {item.quantitySold})
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Max quantity to sell"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? 0 : Number(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              disabled={busy}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-sm border p-3">
                  <FormLabel className="cursor-pointer">Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={busy}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy && <LoaderCircle className="mr-2 size-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
