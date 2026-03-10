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
import { useUpdateInventory } from "@/hooks/inventory/use-update-inventory";
import InventoryResponse from "@/lib/schemas/inventory/inventory-response";

const editInventorySchema = z.object({
  quantityAvailable: z.number().int().min(0, "Quantity cannot be negative"),
});

type EditInventoryFormValues = z.infer<typeof editInventorySchema>;

interface EditInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory: InventoryResponse;
}

export function EditInventoryDialog({
  open,
  onOpenChange,
  inventory,
}: EditInventoryDialogProps) {
  const { handleUpdateInventory, isLoading } = useUpdateInventory();

  const form = useForm<EditInventoryFormValues>({
    resolver: zodResolver(editInventorySchema),
    defaultValues: {
      quantityAvailable: inventory.quantityAvailable,
    },
  });

  async function onSubmit(values: EditInventoryFormValues) {
    const success = await handleUpdateInventory(inventory.id, {
      quantityAvailable: values.quantityAvailable,
    });

    if (success) {
      onOpenChange(false);
    }
  }

  const busy = isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Edit Inventory</DialogTitle>
          <DialogDescription>
            Update stock quantity for{" "}
            <strong>{inventory.plantVariant?.sku ?? inventory.id}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantityAvailable"
              disabled={busy}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity Available</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      value={field.value}
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
