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
import { useUpdateCareInstruction } from "@/hooks/care-instruction/use-update-care-instruction";
import CareInstructionResponse from "@/lib/schemas/care-instruction.ts/care-instruction-response";

const editCareInstructionSchema = z.object({
  lightRequirement: z.string().min(1, "Light requirement is required"),
  wateringFrequency: z.string().min(1, "Watering frequency is required"),
  temperature: z.string().min(1, "Temperature is required"),
  soil: z.string().min(1, "Soil information is required"),
  notes: z.string().min(1, "Notes are required"),
});

type EditCareInstructionFormValues = z.infer<typeof editCareInstructionSchema>;

interface EditCareInstructionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  careInstruction: CareInstructionResponse | null;
}

export function EditCareInstructionDialog({
  open,
  onOpenChange,
  careInstruction,
}: EditCareInstructionDialogProps) {
  const { handleUpdateCareInstruction, isLoading } = useUpdateCareInstruction();

  const form = useForm<EditCareInstructionFormValues>({
    resolver: zodResolver(editCareInstructionSchema),
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

    const success = await handleUpdateCareInstruction(careInstruction.id, {
      lightRequirement: values.lightRequirement,
      wateringFrequency: values.wateringFrequency,
      temperature: values.temperature,
      soil: values.soil,
      notes: values.notes,
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
          <DialogTitle>Edit Care Instruction</DialogTitle>
          <DialogDescription>
            Update the care instruction details below.
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
