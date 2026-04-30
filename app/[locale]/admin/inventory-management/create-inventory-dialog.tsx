"use client";

import { Button } from "@/components/ui/button";
import { CreateInventoryRequest } from "@/types/inventory";
import { CreateInventoryRequestValidation } from "@/validations/inventory";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useCreateInventory, useInventories } from "@/lib/hooks/use-inventory";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { usePlants } from "@/lib/hooks/use-plant";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreateInventoryFormValues = z.infer<
  typeof CreateInventoryRequestValidation
>;

interface CreateInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInventoryDialog({
  open,
  onOpenChange,
}: CreateInventoryDialogProps) {
  const { mutate: createInventory, isPending } = useCreateInventory();
  const { data } = usePlants();
  const { data: inventoriesData } = useInventories();

  const plantsWithVariants = useMemo(
    () =>
      data?.data.items
        .map((plant) => ({
          ...plant,
          variants: plant.variants.filter(
            (variant) =>
              !inventoriesData?.data.some(
                (inventory) => inventory.plantVariantId === variant.id,
              ),
          ),
        }))
        .filter((plant) => plant.variants.length > 0),
    [data, inventoriesData],
  );

  const form = useForm<CreateInventoryFormValues>({
    resolver: zodResolver(CreateInventoryRequestValidation),
    defaultValues: {
      plantVariantId: "",
      quantityAvailable: 0,
    },
  });

  const resetForm = () => {
    form.reset();
  };

  async function onSubmit(values: CreateInventoryFormValues) {
    const request: CreateInventoryRequest = {
      plantVariantId: values.plantVariantId,
      quantityAvailable: values.quantityAvailable,
    };

    createInventory(request, {
      onSuccess: () => {
        resetForm();
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Tạo tồn kho</DialogTitle>
          <DialogDescription>
            Tạo bản ghi tồn kho mới cho một biến thể cây.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="plantVariantId"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biến thể cây</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
                        <SelectValue placeholder="Chọn biến thể" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-72">
                      {plantsWithVariants?.length ? (
                        plantsWithVariants.map((plant) => (
                          <SelectGroup key={plant.id}>
                            <SelectLabel className="text-xs text-muted-foreground">
                              {plant.name}
                            </SelectLabel>
                            {plant.variants.map((variant) => (
                              <SelectItem key={variant.id} value={variant.id}>
                                {variant.sku} — Kích thước {variant.size} —{" "}
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(variant.price)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          Không còn biến thể nào chưa có tồn kho.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantityAvailable"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng khả dụng</FormLabel>
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
