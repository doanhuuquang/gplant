"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreatePlantImageRequest, CreatePlantRequest } from "@/types/plant";
import { CreatePlantRequestValidation } from "@/validations/plant";
import { getFileUrl } from "@/utils/helpers";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MediaPickerDialog } from "@/components/feature/media/media-picker-dialog";
import { MediaResponse } from "@/types/media";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useActiveCategories } from "@/lib/hooks/use-category";
import { useCareInstructions } from "@/lib/hooks/use-care-instruction";
import { useCreatePlant, useCreatePlantImage } from "@/lib/hooks/use-plant";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreatePlantFormValues = z.infer<typeof CreatePlantRequestValidation>;

interface CreatePlantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePlantDialog({
  open,
  onOpenChange,
}: CreatePlantDialogProps) {
  const [pendingImages, setPendingImages] = useState<
    { media: MediaResponse; isPrimary: boolean }[]
  >([]);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const { mutate: createPlant, isPending: isCreatingPlant } = useCreatePlant();
  const { mutate: createPlantImage } = useCreatePlantImage();
  const { data: activeCategoriesResponse } = useActiveCategories();
  const { data: careInstructionsResponse } = useCareInstructions();

  const form = useForm<CreatePlantFormValues>({
    resolver: zodResolver(CreatePlantRequestValidation),
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
    const request: CreatePlantRequest = {
      name: values.name,
      shortDescription: values.shortDescription,
      description: values.description,
      categoryId: values.categoryId,
      careInstructionId: values.careInstructionId,
      isActive: values.isActive,
    };

    createPlant(request, {
      onSuccess: (response) => {
        resetForm();
        onOpenChange(false);

        if (pendingImages.length < 0) return;
        else {
          for (const img of pendingImages) {
            createPlantImage({
              plantId: response.data.id,
              mediaId: img.media.id,
              isPrimary: img.isPrimary,
            } as CreatePlantImageRequest);
          }
        }
      },
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-150 max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Tạo cây</DialogTitle>
            <DialogDescription>
              Điền thông tin bên dưới để tạo cây mới.
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
                  disabled={isCreatingPlant}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên cây" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  disabled={isCreatingPlant}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả ngắn</FormLabel>
                      <FormControl>
                        <Input placeholder="Mô tả ngắn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  disabled={isCreatingPlant}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả chi tiết cây"
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
                  disabled={isCreatingPlant}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isCreatingPlant}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activeCategoriesResponse?.data.map((category) => (
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
                  disabled={isCreatingPlant}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hướng dẫn chăm sóc</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isCreatingPlant}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
                            <SelectValue placeholder="Chọn hướng dẫn chăm sóc" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {careInstructionsResponse?.data.map((ci) => (
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
                      <FormLabel>Hình ảnh</FormLabel>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {pendingImages.length === 0
                          ? "Thêm hình ảnh cho cây này"
                          : `Đã chọn ${pendingImages.length} ảnh`}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isCreatingPlant}
                      onClick={() => setMediaPickerOpen(true)}
                    >
                      <ImagePlus className="size-4 mr-1.5" />
                      Thêm
                    </Button>
                  </div>

                  {pendingImages.length === 0 ? (
                    <button
                      type="button"
                      disabled={isCreatingPlant}
                      onClick={() => setMediaPickerOpen(true)}
                      className="w-full rounded-sm border-2 border-dashed py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <ImagePlus className="size-8 opacity-60" />
                      <span className="text-sm">Nhấn để chọn media</span>
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
                                  Chính
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
                        Nhấn vào ảnh để đặt làm ảnh chính
                      </p>
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-sm border p-3">
                      <FormLabel className="cursor-pointer">
                        Kích hoạt
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isCreatingPlant}
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
                  disabled={isCreatingPlant}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isCreatingPlant}>
                  {isCreatingPlant && (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  )}
                  Tạo
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
