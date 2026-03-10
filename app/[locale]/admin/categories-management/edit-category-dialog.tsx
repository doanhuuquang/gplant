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
import { Switch } from "@/components/ui/switch";
import { useUpdateCategory } from "@/hooks/category/use-update-category";
import { useGetCategories } from "@/hooks/category/use-get-categories";
import { MediaPickerDialog } from "@/components/shared/media-picker-dialog";
import MediaResponse from "@/lib/schemas/media/media-response";
import CategoryResponse from "@/lib/schemas/category/category-response";
import Image from "next/image";

const editCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  parentId: z.string().optional(),
  isActive: z.boolean(),
});

type EditCategoryFormValues = z.infer<typeof editCategorySchema>;

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryResponse | null;
}

export function EditCategoryDialog({
  open,
  onOpenChange,
  category,
}: EditCategoryDialogProps) {
  const { handleUpdateCategory, isLoading } = useUpdateCategory();
  const { categories } = useGetCategories();
  const [selectedMedia, setSelectedMedia] = useState<MediaResponse | null>(
    category?.media
      ? {
          id: "",
          fileName: category.name,
          fileUrl: category.media.fileUrl,
          fileSize: "",
          mimeType: "image/*",
          uploadedBy: {} as MediaResponse["uploadedBy"],
          createdAtUtc: new Date(),
        }
      : null,
  );
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const form = useForm<EditCategoryFormValues>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      parentId: category?.parentId ?? undefined,
      isActive: category?.isActive ?? true,
    },
  });

  const removeImage = () => {
    setSelectedMedia(null);
  };

  async function onSubmit(values: EditCategoryFormValues) {
    if (!category) return;

    const success = await handleUpdateCategory(category.id, {
      name: values.name,
      description: values.description,
      mediaId: selectedMedia?.id || undefined,
      parentId: values.parentId || undefined,
      isActive: values.isActive,
    });

    if (success) {
      onOpenChange(false);
    }
  }

  // Filter out the current category from parent options to prevent self-reference
  const parentOptions = categories.filter((c) => c.id !== category?.id);

  const busy = isLoading;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category details below.
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
                          {parentOptions.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
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
                  {busy && (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  )}
                  Save Changes
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
