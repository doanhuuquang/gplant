"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { getFileUrl } from "@/utils/helpers";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCategory } from "@/hooks/category/use-create-category";
import { useGetCategories } from "@/hooks/category/use-get-categories";
import { MediaPickerDialog } from "@/components/shared/media-picker-dialog";
import MediaResponse from "@/lib/schemas/media/media-response";
import Image from "next/image";

const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  parentId: z.string().optional(),
});

type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const { handleCreateCategory, isLoading } = useCreateCategory();
  const { categories } = useGetCategories();
  const [selectedMedia, setSelectedMedia] = useState<MediaResponse | null>(
    null,
  );
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      parentId: undefined,
    },
  });

  const removeImage = () => {
    setSelectedMedia(null);
  };

  const resetForm = () => {
    form.reset();
    setSelectedMedia(null);
  };

  async function onSubmit(values: CreateCategoryFormValues) {
    const success = await handleCreateCategory({
      name: values.name,
      description: values.description,
      mediaId: selectedMedia?.id,
      parentId: values.parentId || undefined,
    });

    if (success) {
      resetForm();
      onOpenChange(false);
    }
  }

  const busy = isLoading;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new category.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col flex-1 overflow-hidden gap-4"
            >
              <div className="flex-1 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* Image Selection */}
                <div className="space-y-2">
                  <FormLabel>Image (optional)</FormLabel>
                  <div className="flex items-center gap-4">
                    {selectedMedia ? (
                      <div className="relative size-24 rounded-sm overflow-hidden border">
                        <Image
                          src={getFileUrl(selectedMedia.fileUrl)}
                          alt={selectedMedia.fileName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          disabled={busy}
                          className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80 transition-colors"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setMediaPickerOpen(true)}
                        disabled={busy}
                        className="flex size-24 flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-muted-foreground/50 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                      >
                        <ImagePlus className="size-6" />
                        <span className="text-xs">Choose</span>
                      </button>
                    )}
                    {selectedMedia && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={() => setMediaPickerOpen(true)}
                      >
                        Change
                      </Button>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  disabled={busy}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Category name" {...field} />
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
                          placeholder="Category description"
                          className="min-h-25"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  disabled={busy}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Category (optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={busy}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a parent category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  {busy && (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  )}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={(media) => setSelectedMedia(media)}
        selectedMediaId={selectedMedia?.id}
      />
    </>
  );
}
