"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InventoryResponse, UpdateInventoryRequest } from "@/types/inventory";
import { LoaderCircle } from "lucide-react";
import { UpdateInventoryRequestValidation } from "@/validations/inventory";
import { useForm } from "react-hook-form";
import { useUpdateInventory } from "@/lib/hooks/use-inventory";
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

type EditInventoryFormValues = z.infer<typeof UpdateInventoryRequestValidation>;

interface EditInventoryDialogProps {
  open: boolean;
  inventory: InventoryResponse;
  onOpenChange: (open: boolean) => void;
}

export function EditInventoryDialog({
  open,
  onOpenChange,
  inventory,
}: EditInventoryDialogProps) {
  const { mutate: updateInventory, isPending } = useUpdateInventory();

  const form = useForm<EditInventoryFormValues>({
    resolver: zodResolver(UpdateInventoryRequestValidation),
    defaultValues: {
      quantityAvailable: inventory.quantityAvailable,
    },
  });

  async function onSubmit(values: EditInventoryFormValues) {
    const request: UpdateInventoryRequest = {
      quantityAvailable: values.quantityAvailable,
    };

    updateInventory(
      {
        id: inventory.id,
        data: request,
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tồn kho</DialogTitle>
          <DialogDescription>
            Cập nhật số lượng tồn kho cho{" "}
            <strong>{inventory.plantVariant?.sku ?? inventory.id}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                )}
                Lưu
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
