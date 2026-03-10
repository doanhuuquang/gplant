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
import { Textarea } from "@/components/ui/textarea";
import { useAdjustInventory } from "@/hooks/inventory/use-adjust-inventory";
import InventoryResponse from "@/lib/schemas/inventory/inventory-response";

const adjustInventorySchema = z.object({
  quantity: z
    .number()
    .int()
    .refine((v) => v !== 0, "Quantity cannot be zero"),
  reason: z.string().optional(),
});

type AdjustInventoryFormValues = z.infer<typeof adjustInventorySchema>;

interface AdjustInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: InventoryResponse;
}

export function AdjustInventoryDialog({
  open,
  onOpenChange,
  inventory,
}: AdjustInventoryDialogProps) {
  const { handleAdjustInventory, isLoading } = useAdjustInventory();

  const form = useForm<AdjustInventoryFormValues>({
    resolver: zodResolver(adjustInventorySchema),
    defaultValues: {
      quantity: 0,
      reason: "",
    },
  });

  const resetForm = () => {
    form.reset();
  };

  async function onSubmit(values: AdjustInventoryFormValues) {
    const success = await handleAdjustInventory(inventory.id, {
      quantity: values.quantity,
      reason: values.reason || undefined,
    });

    if (success) {
      resetForm();
      onOpenChange(false);
    }
  }

  const busy = isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Adjust Inventory</DialogTitle>
          <DialogDescription>
            Adjust stock for{" "}
            <strong>{inventory.plantVariant?.sku ?? inventory.id}</strong>.
            Current available: <strong>{inventory.quantityAvailable}</strong>.
            Use positive values to add stock, negative values to remove.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              disabled={busy}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adjustment Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. +10 or -5"
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
              name="reason"
              disabled={busy}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Reason for adjustment..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy && <LoaderCircle className="mr-2 size-4 animate-spin" />}
                Adjust
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
