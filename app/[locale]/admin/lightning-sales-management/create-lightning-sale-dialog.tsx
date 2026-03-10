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
import { useCreateLightningSale } from "@/hooks/lightning-sale/use-create-lightning-sale";

const createLightningSaleSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    startDateUtc: z.string().min(1, "Start date is required"),
    endDateUtc: z.string().min(1, "End date is required"),
  })
  .refine((data) => new Date(data.endDateUtc) > new Date(data.startDateUtc), {
    message: "End date must be after start date",
    path: ["endDateUtc"],
  })
  .refine((data) => new Date(data.endDateUtc) > new Date(), {
    message: "End date must be in the future",
    path: ["endDateUtc"],
  });

type CreateLightningSaleFormValues = z.infer<typeof createLightningSaleSchema>;

interface CreateLightningSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLightningSaleDialog({
  open,
  onOpenChange,
}: CreateLightningSaleDialogProps) {
  const { handleCreateLightningSale, isLoading } = useCreateLightningSale();

  const form = useForm<CreateLightningSaleFormValues>({
    resolver: zodResolver(createLightningSaleSchema),
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
    const success = await handleCreateLightningSale({
      name: values.name,
      description: values.description,
      startDateUtc: new Date(values.startDateUtc).toISOString(),
      endDateUtc: new Date(values.endDateUtc).toISOString(),
    });

    if (success) {
      resetForm();
      onOpenChange(false);
    }
  }

  const busy = isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Lightning Sale</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new lightning sale event.
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
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy && <LoaderCircle className="mr-2 size-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
