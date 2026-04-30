"use client";

import { Button } from "@/components/ui/button";
import {
  CareInstructionResponse,
  UpdateCareInstructionRequest,
} from "@/types/care-instruction";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UpdateCareInstructionRequestValidation } from "@/validations/care-instruction";
import { useForm } from "react-hook-form";
import { useUpdateCareInstruction } from "@/lib/hooks/use-care-instruction";
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

type EditCareInstructionFormValues = z.infer<
  typeof UpdateCareInstructionRequestValidation
>;

interface EditCareInstructionDialogProps {
  open: boolean;
  careInstruction: CareInstructionResponse | null;
  onOpenChange: (open: boolean) => void;
}

export function EditCareInstructionDialog({
  open,
  onOpenChange,
  careInstruction,
}: EditCareInstructionDialogProps) {
  const { mutate: updateCareInstruction, isPending } =
    useUpdateCareInstruction();

  const form = useForm<EditCareInstructionFormValues>({
    resolver: zodResolver(UpdateCareInstructionRequestValidation),
    defaultValues: {
      lightRequirement: careInstruction?.lightRequirement ?? "",
      wateringFrequency: careInstruction?.wateringFrequency ?? "",
      temperature: careInstruction?.temperature ?? "",
      soil: careInstruction?.soil ?? "",
      notes: careInstruction?.notes ?? "",
    },
  });

  async function onSubmit(values: EditCareInstructionFormValues) {
    if (!careInstruction) return;

    const request: UpdateCareInstructionRequest = {
      lightRequirement: values.lightRequirement,
      wateringFrequency: values.wateringFrequency,
      temperature: values.temperature,
      soil: values.soil,
      notes: values.notes,
    };

    updateCareInstruction(
      {
        id: careInstruction.id,
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
          <DialogTitle>Chỉnh sửa hướng dẫn chăm sóc</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin hướng dẫn chăm sóc bên dưới.
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
                name="lightRequirement"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhu cầu ánh sáng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: Nắng đầy đủ, Bóng râm một phần"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wateringFrequency"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tần suất tưới nước</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: 1 lần/tuần, 2 lần/tuần"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="temperature"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhiệt độ</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: 18-24°C" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="soil"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đất</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: Thoát nước tốt, đất cát pha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ghi chú chăm sóc thêm"
                        className="min-h-25"
                        {...field}
                      />
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
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
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
