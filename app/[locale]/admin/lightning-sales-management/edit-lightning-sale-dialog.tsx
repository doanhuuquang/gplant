"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LightningSaleResponse,
  UpdateLightningSaleRequest,
} from "@/types/lightning-sale";
import { LoaderCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UpdateLightningSaleRequestValidation } from "@/validations/lightning-sale";
import { useForm } from "react-hook-form";
import { useUpdateLightningSale } from "@/lib/hooks/use-lightning-sale";
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

type EditLightningSaleFormValues = z.infer<
  typeof UpdateLightningSaleRequestValidation
>;

interface EditLightningSaleDialogProps {
  open: boolean;
  sale: LightningSaleResponse;
  onOpenChange: (open: boolean) => void;
}

function toLocalDateTime(dateStr: string) {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function EditLightningSaleDialog({
  open,
  onOpenChange,
  sale,
}: EditLightningSaleDialogProps) {
  const { mutate: updateLightningSale, isPending } = useUpdateLightningSale();

  const form = useForm<EditLightningSaleFormValues>({
    resolver: zodResolver(UpdateLightningSaleRequestValidation),
    defaultValues: {
      name: sale.name,
      description: sale.description,
      startDateUtc: toLocalDateTime(sale.startDateUtc),
      endDateUtc: toLocalDateTime(sale.endDateUtc),
      isActive: sale.isActive,
    },
  });

  async function onSubmit(values: EditLightningSaleFormValues) {
    const request: UpdateLightningSaleRequest = {
      name: values.name,
      description: values.description,
      startDateUtc: new Date(values.startDateUtc).toISOString(),
      endDateUtc: new Date(values.endDateUtc).toISOString(),
      isActive: values.isActive,
    };

    updateLightningSale(
      {
        id: sale.id,
        data: request,
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa lightning sale</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chương trình lightning sale bên dưới.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden gap-4"
          >
            <div className="flex-1 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <FormField
                control={form.control}
                name="name"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên chương trình" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chương trình"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDateUtc"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDateUtc"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
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
            </div>

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
