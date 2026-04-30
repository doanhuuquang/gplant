"use client";

import { Button } from "@/components/ui/button";
import { CreateLightningSaleItemRequest } from "@/types/lightning-sale";
import { CreateLightningSaleItemRequestValidation } from "@/validations/lightning-sale";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useCreateLightningSaleItem } from "@/lib/hooks/use-lightning-sale";
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

type AddSaleItemFormValues = z.infer<
  typeof CreateLightningSaleItemRequestValidation
>;

interface AddSaleItemDialogProps {
  open: boolean;
  saleId: string;
  onOpenChange: (open: boolean) => void;
}

export function AddSaleItemDialog({
  open,
  onOpenChange,
  saleId,
}: AddSaleItemDialogProps) {
  const { mutate: createLightningSaleItem, isPending } =
    useCreateLightningSaleItem();
  const { data } = usePlants();

  const plantsWithVariants = useMemo(
    () => data?.data.items.filter((p) => p.variants?.length > 0),
    [data],
  );

  const form = useForm<AddSaleItemFormValues>({
    resolver: zodResolver(CreateLightningSaleItemRequestValidation),
    defaultValues: {
      plantVariantId: "",
      salePrice: 0,
      quantityLimit: 1,
    },
  });

  const resetForm = () => {
    form.reset();
  };

  async function onSubmit(values: AddSaleItemFormValues) {
    const request: CreateLightningSaleItemRequest = {
      plantVariantId: values.plantVariantId,
      salePrice: values.salePrice,
      quantityLimit: values.quantityLimit,
    };

    createLightningSaleItem(
      {
        lightningSaleId: saleId,
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
          <DialogTitle>Thêm sản phẩm khuyến mãi</DialogTitle>
          <DialogDescription>
            Thêm một biến thể cây vào chương trình lightning sale này.
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
                      <SelectTrigger className="h-12! w-full rounded-sm shadow-none">
                        <SelectValue placeholder="Chọn biến thể" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-72">
                      {plantsWithVariants?.map((plant) => (
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
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormLabel>Giới hạn số lượng</FormLabel>
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
                Thêm sản phẩm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
