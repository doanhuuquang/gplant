"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import Image from "next/image";
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
import { useCreatePlant } from "@/hooks/plant/use-create-plant";
import { useGetActiveCategories } from "@/hooks/category/use-get-active-categories";
import { useGetCareInstructions } from "@/hooks/care-instruction/use-get-care-instructions";
import { MediaPickerDialog } from "@/components/shared/media-picker-dialog";
import MediaResponse from "@/lib/schemas/media/media-response";
import { createPlantImageApi } from "@/services/plant-image-service";
import { usePlantStore } from "@/stores/plant-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const createPlantSchema = z.object({
  name: z.string().min(1, "Plant name is required"),
  shortDescription: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  careInstructionId: z.string().min(1, "Care instruction is required"),
  isActive: z.boolean(),
});

type CreatePlantFormValues = z.infer<typeof createPlantSchema>;

interface CreatePlantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePlantDialog({
  open,
  onOpenChange,
}: CreatePlantDialogProps) {
  const { handleCreatePlant, isLoading } = useCreatePlant();
  const { activeCategories } = useGetActiveCategories();
  const { careInstructions } = useGetCareInstructions();
  const { fetchPlants } = usePlantStore();

  const [pendingImages, setPendingImages] = useState<
    { media: MediaResponse; isPrimary: boolean }[]
  >([]);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const form = useForm<CreatePlantFormValues>({
    resolver: zodResolver(createPlantSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      categoryId: "",
      careInstructionId: "",
      isActive: true,
    },
  });

  const resetForm = () => {
    form.reset();
    setPendingImages([]);
  };

  const handleMediaSelected = (media: MediaResponse) => {
    if (pendingImages.some((img) => img.media.id === media.id)) return;
    setPendingImages((prev) => [
      ...prev,
      { media, isPrimary: prev.length === 0 },
    ]);
  };

  const handleRemoveImage = (mediaId: string) => {
    setPendingImages((prev) => {
      const filtered = prev.filter((img) => img.media.id !== mediaId);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return [...filtered];
    });
  };

  const handleSetPrimary = (mediaId: string) => {
    setPendingImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.media.id === mediaId })),
    );
  };

  async function onSubmit(values: CreatePlantFormValues) {
    const createdPlant = await handleCreatePlant({
      name: values.name,
      shortDescription: values.shortDescription,
      description: values.description,
      categoryId: values.categoryId,
      careInstructionId: values.careInstructionId,
      isActive: values.isActive,
    });

    if (createdPlant) {
      if (pendingImages.length > 0) {
        try {
          for (const img of pendingImages) {
            await createPlantImageApi({
              plantId: createdPlant.id,
              mediaId: img.media.id,
              isPrimary: img.isPrimary,
            });
          }
        } catch {
          toast.error("Image error", {
            description: "Some images could not be added to the plant.",
          });
        }
        await fetchPlants();
      }
      resetForm();
      onOpenChange(false);
    }
  }

  const busy = isLoading;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-150 max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create Plant</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new plant.
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
                        <Input placeholder="Plant name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  disabled={busy}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description" {...field} />
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
                          placeholder="Full plant description"
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
                  name="categoryId"
                  disabled={busy}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={busy}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeCategories.map((category) => (
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

                <FormField
                  control={form.control}
                  name="careInstructionId"
                  disabled={busy}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Care Instruction</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={busy}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
                            <SelectValue placeholder="Select a care instruction" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {careInstructions.map((ci) => (
                            <SelectItem key={ci.id} value={ci.id}>
                              {ci.lightRequirement} / {ci.wateringFrequency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Images Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <FormLabel>Images</FormLabel>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {pendingImages.length === 0
                          ? "Add images for this plant"
                          : `${pendingImages.length} image${pendingImages.length > 1 ? "s" : ""} selected`}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => setMediaPickerOpen(true)}
                    >
                      <ImagePlus className="size-4 mr-1.5" />
                      Add
                    </Button>
                  </div>

                  {pendingImages.length === 0 ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setMediaPickerOpen(true)}
                      className="w-full rounded-sm border-2 border-dashed py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <ImagePlus className="size-8 opacity-60" />
                      <span className="text-sm">Click to browse media</span>
                    </button>
                  ) : (
                    <div className="rounded-sm border bg-muted/30 p-2">
                      <div className="grid grid-cols-3 gap-2">
                        {pendingImages.map((img) => (
                          <div
                            key={img.media.id}
                            className={cn(
                              "relative aspect-square rounded-sm overflow-hidden group cursor-pointer ring-offset-background transition-all",
                              img.isPrimary
                                ? "ring-2 ring-primary ring-offset-2"
                                : "ring-1 ring-border hover:ring-primary/50",
                            )}
                            onClick={() => handleSetPrimary(img.media.id)}
                          >
                            <Image
                              src={getFileUrl(img.media.fileUrl)}
                              alt={img.media.fileName}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            {img.isPrimary && (
                              <div className="absolute inset-x-0 bottom-0 bg-primary/90 px-2 py-0.5 text-center">
                                <span className="text-[10px] font-semibold text-primary-foreground uppercase tracking-wider">
                                  Primary
                                </span>
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(img.media.id);
                              }}
                              className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-2 text-center">
                        Click an image to set as primary
                      </p>
                    </div>
                  )}
                </div>

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
        onSelect={handleMediaSelected}
      />
    </>
  );
}
