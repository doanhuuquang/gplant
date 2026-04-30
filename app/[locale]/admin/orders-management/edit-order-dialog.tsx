"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { OrderResponse } from "@/types/order";
import { UpdateOrderStatusRequestValidation } from "@/validations/order";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateOrderStatus } from "@/lib/hooks/use-order";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ORDER_STATUS_OPTIONS = [
  { value: "Pending", label: "Chờ xử lý" },
  { value: "Confirmed", label: "Đã xác nhận" },
  { value: "Processing", label: "Đang xử lý" },
  { value: "Shipped", label: "Đã gửi" },
  { value: "Delivered", label: "Đã giao" },
  { value: "Cancelled", label: "Đã hủy" },
  { value: "Refunded", label: "Đã hoàn tiền" },
] as const;

type EditOrderFormValues = z.infer<typeof UpdateOrderStatusRequestValidation>;

interface EditOrderDialogProps {
  open: boolean;
  order: OrderResponse | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditOrderDialog({
  open,
  onOpenChange,
  order,
  onSuccess,
}: EditOrderDialogProps) {
  const form = useForm<EditOrderFormValues>({
    resolver: zodResolver(UpdateOrderStatusRequestValidation),
    defaultValues: {
      status: order?.status ?? "Pending",
      note: "",
    },
  });

  useEffect(() => {
    if (open && order) {
      form.reset({
        status: order.status ?? "Pending",
        note: "",
      });
    }
  }, [open, order, form]);

  const { mutate: updateOrderStatus, isPending } = useUpdateOrderStatus(
    order?.id ?? "",
  );

  async function onSubmit(values: EditOrderFormValues) {
    if (!order) return;

    updateOrderStatus(values, {
      onSuccess: () => {
        onSuccess?.();
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          <DialogDescription>
            Thay đổi trạng thái cho đơn hàng {order?.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái đơn hàng</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ORDER_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập ghi chú về thay đổi trạng thái (tùy chọn)"
                      className="min-h-20"
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
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                )}
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
