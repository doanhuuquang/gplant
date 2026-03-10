"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import { useEffect, useMemo } from "react";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCreateInventory } from "@/hooks/inventory/use-create-inventory";
import { usePlantStore } from "@/stores/plant-store";

const createInventorySchema = z.object({
  plantVariantId: z.string().min(1, "Please select a plant variant"),
  quantityAvailable: z.number().int().min(0, "Quantity cannot be negative"),
});

type CreateInventoryFormValues = z.infer<typeof createInventorySchema>;

interface CreateInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInventoryDialog({
  open,
  onOpenChange,
}: CreateInventoryDialogProps) {
  const { handleCreateInventory, isLoading } = useCreateInventory();
  const { plants, fetchPlants } = usePlantStore();

  useEffect(() => {
    if (open && !plants?.length) {
      fetchPlants({ pageSize: 1000 });
    }
  }, [open, plants?.length, fetchPlants]);

  const plantsWithVariants = useMemo(
    () => plants.filter((p) => p.variants?.length > 0),
    [plants],
  );

  const form = useForm<CreateInventoryFormValues>({
    resolver: zodResolver(createInventorySchema),
    defaultValues: {
      plantVariantId: "",
      quantityAvailable: 0,
    },
  });

  const resetForm = () => {
    form.reset();
  };

  async function onSubmit(values: CreateInventoryFormValues) {
    const success = await handleCreateInventory({
      plantVariantId: values.plantVariantId,
      quantityAvailable: values.quantityAvailable,
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
          <DialogTitle>Create Inventory</DialogTitle>
          <DialogDescription>
            Create a new inventory entry for a plant variant.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="plantVariantId"
              disabled={busy}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Variant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={busy}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
                        <SelectValue placeholder="Select a variant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-72">
                      {plantsWithVariants.map((plant) => (
                        <SelectGroup key={plant.id}>
                          <SelectLabel className="text-xs text-muted-foreground">
                            {plant.name}
                          </SelectLabel>
                          {plant.variants.map((variant) => (
                            <SelectItem key={variant.id} value={variant.id}>
                              {variant.sku} — Size {variant.size} —{" "}
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(variant.price)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
