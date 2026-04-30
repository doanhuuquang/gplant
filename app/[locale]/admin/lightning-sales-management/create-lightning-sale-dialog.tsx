"use client";

import { Button } from "@/components/ui/button";
import { CreateLightningSaleRequest } from "@/types/lightning-sale";
import { CreateLightningSaleRequestValidation } from "@/validations/lightning-sale";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLightningSale } from "@/lib/hooks/use-lightning-sale";
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

type CreateLightningSaleFormValues = z.infer<
  typeof CreateLightningSaleRequestValidation
>;

interface CreateLightningSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLightningSaleDialog({
  open,
  onOpenChange,
}: CreateLightningSaleDialogProps) {
  const { mutate: createLightningSale, isPending } = useCreateLightningSale();

  const form = useForm<CreateLightningSaleFormValues>({
    resolver: zodResolver(CreateLightningSaleRequestValidation),
    defaultValues: {
      name: "",
      description: "",
      startDateUtc: "",
      endDateUtc: "",
    },
  });

  const resetForm = () => {
    form.reset();
  };

  async function onSubmit(values: CreateLightningSaleFormValues) {
    const request: CreateLightningSaleRequest = {
      name: values.name,
      description: values.description,
      startDateUtc: new Date(values.startDateUtc).toISOString(),
      endDateUtc: new Date(values.endDateUtc).toISOString(),
    };

    createLightningSale(request, {
      onSuccess: () => {
        resetForm();
        onOpenChange(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Tạo lightning sale</DialogTitle>
          <DialogDescription>
            Điền thông tin bên dưới để tạo chương trình lightning sale mới.
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
            </div>

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
