"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  LightningSaleItemResponse,
  UpdateLightningSaleItemRequest,
} from "@/types/lightning-sale";
import { UpdateLightningSaleItemRequestValidation } from "@/validations/lightning-sale";
import { useForm } from "react-hook-form";
import { useUpdateLightningSaleItem } from "@/lib/hooks/use-lightning-sale";
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

type EditSaleItemFormValues = z.infer<
  typeof UpdateLightningSaleItemRequestValidation
>;

interface EditSaleItemDialogProps {
  open: boolean;
  item: LightningSaleItemResponse;
  onOpenChange: (open: boolean) => void;
}

export function EditSaleItemDialog({
  open,
  onOpenChange,
  item,
}: EditSaleItemDialogProps) {
  const { mutate: updateLightningSaleItem, isPending } =
    useUpdateLightningSaleItem();

  const form = useForm<EditSaleItemFormValues>({
    resolver: zodResolver(UpdateLightningSaleItemRequestValidation),
    defaultValues: {
      salePrice: item.salePrice,
      quantityLimit: item.quantityLimit,
      isActive: item.isActive,
    },
  });

  async function onSubmit(values: EditSaleItemFormValues) {
    const request: UpdateLightningSaleItemRequest = {
      salePrice: values.salePrice,
      quantityLimit: values.quantityLimit,
      isActive: values.isActive,
    };

    updateLightningSaleItem(
      {
        lightningSaleItemId: item.id,
        data: request,
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa sản phẩm khuyến mãi</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin sản phẩm khuyến mãi. Giá gốc:{" "}
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
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá sale (VND)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập giá sale"
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
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Giới hạn số lượng (đã bán: {item.quantitySold})
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Số lượng bán tối đa"
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
              disabled={isPending}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-sm border p-3">
                  <FormLabel className="cursor-pointer">Kích hoạt</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
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
