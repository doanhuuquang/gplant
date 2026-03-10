"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useUpdateLightningSale } from "@/hooks/lightning-sale/use-update-lightning-sale";
import { LightningSaleResponse } from "@/lib/schemas/lightning-sale/lightning-sale-response";

const editLightningSaleSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    startDateUtc: z.string().min(1, "Start date is required"),
    endDateUtc: z.string().min(1, "End date is required"),
    isActive: z.boolean(),
  })
  .refine((data) => new Date(data.endDateUtc) > new Date(data.startDateUtc), {
    message: "End date must be after start date",
    path: ["endDateUtc"],
  });

type EditLightningSaleFormValues = z.infer<typeof editLightningSaleSchema>;

interface EditLightningSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: LightningSaleResponse;
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
  const { handleUpdateLightningSale, isLoading } = useUpdateLightningSale();

  const form = useForm<EditLightningSaleFormValues>({
    resolver: zodResolver(editLightningSaleSchema),
    defaultValues: {
      name: sale.name,
      description: sale.description,
      startDateUtc: toLocalDateTime(sale.startDateUtc),
      endDateUtc: toLocalDateTime(sale.endDateUtc),
      isActive: sale.isActive,
    },
  });

  async function onSubmit(values: EditLightningSaleFormValues) {
    const success = await handleUpdateLightningSale(sale.id, {
      name: values.name,
      description: values.description,
      startDateUtc: new Date(values.startDateUtc).toISOString(),
      endDateUtc: new Date(values.endDateUtc).toISOString(),
      isActive: values.isActive,
    });

    if (success) {
      onOpenChange(false);
    }
  }

  const busy = isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Lightning Sale</DialogTitle>
          <DialogDescription>
            Update the lightning sale details below.
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
                disabled={busy}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sale name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                disabled={busy}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Sale description"
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
                disabled={busy}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
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
                disabled={busy}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
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
                disabled={busy}
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-sm border p-3">
                    <FormLabel className="cursor-pointer">Active</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={busy}
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
                disabled={busy}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy && <LoaderCircle className="mr-2 size-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
