"use client";

import { AdjustInventoryRequest, InventoryResponse } from "@/types/inventory";
import { AdjustInventoryRequestValidation } from "@/validations/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAdjustInventory } from "@/lib/hooks/use-inventory";
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

type AdjustInventoryFormValues = z.infer<
  typeof AdjustInventoryRequestValidation
>;

interface AdjustInventoryDialogProps {
  open: boolean;
  inventory: InventoryResponse;
  onOpenChange: (open: boolean) => void;
}

export function AdjustInventoryDialog({
  open,
  onOpenChange,
  inventory,
}: AdjustInventoryDialogProps) {
  const { mutate: adjustInventory, isPending } = useAdjustInventory();

  const form = useForm<AdjustInventoryFormValues>({
    resolver: zodResolver(AdjustInventoryRequestValidation),
    defaultValues: {
      quantity: 0,
      reason: "",
    },
  });

  const resetForm = () => {
    form.reset();
  };

  async function onSubmit(values: AdjustInventoryFormValues) {
    const request: AdjustInventoryRequest = {
      quantity: values.quantity,
      reason: values.reason || undefined,
    };

    adjustInventory(
      {
        id: inventory.id,
        data: request,
      },
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Điều chỉnh tồn kho</DialogTitle>
          <DialogDescription>
            Điều chỉnh tồn kho cho{" "}
            <strong>{inventory.plantVariant?.sku ?? inventory.id}</strong>. Hiện
            khả dụng: <strong>{inventory.quantityAvailable}</strong>. Dùng số
            dương để thêm hàng, số âm để trừ hàng.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng điều chỉnh</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ví dụ: +10 hoặc -5"
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
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Lý do điều chỉnh..." {...field} />
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
                Điều chỉnh
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
