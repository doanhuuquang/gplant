"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getFileUrl } from "@/utils/helpers";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MediaPickerDialog } from "@/components/feature/media/media-picker-dialog";
import { MediaResponse } from "@/types/media";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UpdatePlantRequestValidation } from "@/validations/plant";
import { useActiveCategories } from "@/lib/hooks/use-category";
import { useCareInstructions } from "@/lib/hooks/use-care-instruction";
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
import {
  CreatePlantImageRequest,
  PlantResponse,
  UpdatePlantRequest,
} from "@/types/plant";
import {
  useCreatePlantImage,
  useDeletePlantImage,
  useSetPrimaryPlantImage,
  useUpdatePlant,
} from "@/lib/hooks/use-plant";

type EditPlantFormValues = z.infer<typeof UpdatePlantRequestValidation>;

interface EditPlantDialogProps {
  open: boolean;
  plant: PlantResponse | null;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditPlantDialog({
  open,
  onOpenChange,
  plant,
  onSuccess,
}: EditPlantDialogProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [imageState, setImageState] = useState<{
    primaryKey: string;
    removedImageIds: string[];
    newImages: { media: MediaResponse; isPrimary: boolean }[];
  }>(() => {
    const primary = plant?.images?.find((i) => i.isPrimary);
    return {
      primaryKey: primary ? `existing-${primary.id}` : "",
      removedImageIds: [],
      newImages: [],
    };
  });

  const { mutate: updatePlant, isPending: isUpdatingPlant } = useUpdatePlant();
  const { mutate: deletePlantImage } = useDeletePlantImage();
  const { mutate: createPlantImage } = useCreatePlantImage();
  const { mutate: setPrimaryPlantImage } = useSetPrimaryPlantImage();
  const { data: activeCategoriesResponse } = useActiveCategories();
  const { data: careInstructionsResponse } = useCareInstructions();

  const existingImages = (plant?.images ?? []).filter(
    (img) => !imageState.removedImageIds.includes(img.id),
  );

  const form = useForm<EditPlantFormValues>({
    resolver: zodResolver(UpdatePlantRequestValidation),
    defaultValues: {
      name: plant?.name ?? "",
      shortDescription: plant?.shortDescription ?? "",
      description: plant?.description ?? "",
      categoryId: plant?.category?.id ?? "",
      careInstructionId: plant?.careInstruction?.id ?? "",
      isActive: plant?.isActive ?? true,
    },
  });

  const handleMediaSelected = (media: MediaResponse) => {
    if (existingImages.some((img) => img.media?.id === media.id)) return;
    if (imageState.newImages.some((img) => img.media.id === media.id)) return;
    const allEmpty =
      existingImages.length === 0 && imageState.newImages.length === 0;
    const updatedNewImages = [
      ...imageState.newImages,
      { media, isPrimary: false },
    ];
    setImageState((prev) => ({
      ...prev,
      newImages: updatedNewImages,
      primaryKey: allEmpty ? `new-${media.id}` : prev.primaryKey,
    }));
  };

  const handleRemoveExisting = (imageId: string) => {
    const updatedRemovedIds = [...imageState.removedImageIds, imageId];
    let newPrimaryKey = imageState.primaryKey;

    if (imageState.primaryKey === `existing-${imageId}`) {
      const remaining = existingImages.filter((img) => img.id !== imageId);
      if (remaining.length > 0) {
        newPrimaryKey = `existing-${remaining[0].id}`;
      } else if (imageState.newImages.length > 0) {
        newPrimaryKey = `new-${imageState.newImages[0].media.id}`;
      } else {
        newPrimaryKey = "";
      }
    }

    setImageState((prev) => ({
      ...prev,
      removedImageIds: updatedRemovedIds,
      primaryKey: newPrimaryKey,
    }));
  };

  const handleRemoveNew = (mediaId: string) => {
    const remainingNew = imageState.newImages.filter(
      (img) => img.media.id !== mediaId,
    );
    let newPrimaryKey = imageState.primaryKey;

    if (imageState.primaryKey === `new-${mediaId}`) {
      if (existingImages.length > 0) {
        newPrimaryKey = `existing-${existingImages[0].id}`;
      } else if (remainingNew.length > 0) {
        newPrimaryKey = `new-${remainingNew[0].media.id}`;
      } else {
        newPrimaryKey = "";
      }
    }

    setImageState((prev) => ({
      ...prev,
      newImages: remainingNew,
      primaryKey: newPrimaryKey,
    }));
  };

  async function onSubmit(values: EditPlantFormValues) {
    if (!plant) return;

    const request: UpdatePlantRequest = {
      name: values.name,
      shortDescription: values.shortDescription,
      description: values.description,
      categoryId: values.categoryId,
      careInstructionId: values.careInstructionId,
      isActive: values.isActive,
    };

    updatePlant(
      { id: plant.id, request: request },
      {
        onSuccess: () => {
          onSuccess?.();
          onOpenChange(false);

          const hasImageChanges =
            imageState.removedImageIds.length > 0 ||
            imageState.newImages.length > 0 ||
            imageState.primaryKey !==
              `existing-${plant.images?.find((i) => i.isPrimary)?.id ?? ""}`;

          if (hasImageChanges) {
            for (const id of imageState.removedImageIds) {
              deletePlantImage(id);
            }

            for (const img of imageState.newImages) {
              createPlantImage({
                plantId: plant.id,
                mediaId: img.media.id,
                isPrimary: imageState.primaryKey === `new-${img.media.id}`,
              } as CreatePlantImageRequest);
            }

            if (imageState.primaryKey.startsWith("existing-")) {
              const targetId = imageState.primaryKey.replace("existing-", "");
              const originalPrimary = plant.images?.find((i) => i.isPrimary);
              if (originalPrimary?.id !== targetId) {
                setPrimaryPlantImage(targetId);
              }
            }
          }
        },
      },
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-150 max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa cây</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cây bên dưới.
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
                  disabled={isUpdatingPlant}
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
                  disabled={isUpdatingPlant}
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
                  disabled={isUpdatingPlant}
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
                  disabled={isUpdatingPlant}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isUpdatingPlant}
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
                  disabled={isUpdatingPlant}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hướng dẫn chăm sóc</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isUpdatingPlant}
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
                        {existingImages.length + imageState.newImages.length ===
                        0
                          ? "Thêm hình ảnh cho cây này"
                          : `Đã có ${existingImages.length + imageState.newImages.length} ảnh`}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUpdatingPlant}
                      onClick={() => setMediaPickerOpen(true)}
                    >
                      <ImagePlus className="size-4 mr-1.5" />
                      Thêm
                    </Button>
                  </div>

                  {existingImages.length === 0 &&
                  imageState.newImages.length === 0 ? (
                    <button
                      type="button"
                      disabled={isUpdatingPlant}
                      onClick={() => setMediaPickerOpen(true)}
                      className="w-full rounded-sm border-2 border-dashed py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <ImagePlus className="size-8 opacity-60" />
                      <span className="text-sm">Nhấn để chọn media</span>
                    </button>
                  ) : (
                    <div className="rounded-sm border bg-muted/30 p-2">
                      <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((img) => {
                          const key = `existing-${img.id}`;
                          const isPrimary = imageState.primaryKey === key;
                          return (
                            <div
                              key={img.id}
                              className={cn(
                                "relative aspect-square rounded-sm overflow-hidden group cursor-pointer ring-offset-background transition-all",
                                isPrimary
                                  ? "ring-2 ring-primary ring-offset-2"
                                  : "ring-1 ring-border hover:ring-primary/50",
                              )}
                              onClick={() =>
                                setImageState((prev) => ({
                                  ...prev,
                                  primaryKey: key,
                                }))
                              }
                            >
                              {img.media?.fileUrl && (
                                <Image
                                  src={getFileUrl(img.media.fileUrl)}
                                  alt={img.media?.fileName ?? "Plant image"}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              )}
                              {isPrimary && (
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
                                  handleRemoveExisting(img.id);
                                }}
                                className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          );
                        })}
                        {imageState.newImages.map((img) => {
                          const key = `new-${img.media.id}`;
                          const isPrimary = imageState.primaryKey === key;
                          return (
                            <div
                              key={img.media.id}
                              className={cn(
                                "relative aspect-square rounded-sm overflow-hidden group cursor-pointer ring-offset-background transition-all",
                                isPrimary
                                  ? "ring-2 ring-primary ring-offset-2"
                                  : "ring-1 ring-border hover:ring-primary/50",
                              )}
                              onClick={() =>
                                setImageState((prev) => ({
                                  ...prev,
                                  primaryKey: key,
                                }))
                              }
                            >
                              <Image
                                src={getFileUrl(img.media.fileUrl)}
                                alt={img.media.fileName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                              {isPrimary && (
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
                                  handleRemoveNew(img.media.id);
                                }}
                                className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          );
                        })}
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
                          disabled={isUpdatingPlant}
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
                  disabled={isUpdatingPlant}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isUpdatingPlant}>
                  {isUpdatingPlant && (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  )}
                  Lưu thay đổi
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
