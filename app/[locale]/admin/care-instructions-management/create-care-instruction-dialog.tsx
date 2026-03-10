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
import { useCreateCareInstruction } from "@/hooks/care-instruction/use-create-care-instruction";

const createCareInstructionSchema = z.object({
  lightRequirement: z.string().min(1, "Light requirement is required"),
  wateringFrequency: z.string().min(1, "Watering frequency is required"),
  temperature: z.string().min(1, "Temperature is required"),
  soil: z.string().min(1, "Soil information is required"),
  notes: z.string().min(1, "Notes are required"),
});

type CreateCareInstructionFormValues = z.infer<
  typeof createCareInstructionSchema
>;

interface CreateCareInstructionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCareInstructionDialog({
  open,
  onOpenChange,
}: CreateCareInstructionDialogProps) {
  const { handleCreateCareInstruction, isLoading } = useCreateCareInstruction();

  const form = useForm<CreateCareInstructionFormValues>({
    resolver: zodResolver(createCareInstructionSchema),
    defaultValues: {
      lightRequirement: "",
      wateringFrequency: "",
      temperature: "",
      soil: "",
      notes: "",
    },
  });

  const resetForm = () => {
    form.reset();
  };

  async function onSubmit(values: CreateCareInstructionFormValues) {
    const success = await handleCreateCareInstruction({
      lightRequirement: values.lightRequirement,
      wateringFrequency: values.wateringFrequency,
      temperature: values.temperature,
      soil: values.soil,
      notes: values.notes,
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
          <DialogTitle>Create Care Instruction</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new care instruction.
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
                disabled={busy}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Light Requirement</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Full sun, Partial shade"
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
                disabled={busy}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Watering Frequency</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Once a week, Twice a week"
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
                disabled={busy}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 18-24°C" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="soil"
                disabled={busy}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Well-drained, Sandy loam"
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
                disabled={busy}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional care notes"
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
