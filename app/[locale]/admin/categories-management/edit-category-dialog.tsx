"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CategoryResponse, UpdateCategoryRequest } from "@/types/category";
import { getFileUrl } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import { LoaderCircle, X } from "lucide-react";
import { MediaPickerDialog } from "@/components/feature/media/media-picker-dialog";
import { MediaResponse } from "@/types/media";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UpdateCategoryRequestValidation } from "@/validations/category";
import { useCategories, useUpdateCategory } from "@/lib/hooks/use-category";
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

type EditCategoryFormValues = z.infer<typeof UpdateCategoryRequestValidation>;

interface EditCategoryDialogProps {
  open: boolean;
  category: CategoryResponse | null;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({
  open,
  onOpenChange,
  category,
}: EditCategoryDialogProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaResponse | null>(
    category?.media
      ? {
          id: category.media.id,
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

  const { mutate: updateCategory, isPending } = useUpdateCategory();
  const { data } = useCategories();

  const form = useForm<EditCategoryFormValues>({
    resolver: zodResolver(UpdateCategoryRequestValidation),
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      mediaId: category?.media ? category.media.id : undefined,
      parentId: category?.parentId ?? undefined,
      isActive: category?.isActive ?? true,
    },
  });

  const removeImage = () => {
    setSelectedMedia(null);
  };

  async function onSubmit(values: EditCategoryFormValues) {
    if (!category) return;

    const request: UpdateCategoryRequest = {
      name: values.name,
      description: values.description,
      mediaId: selectedMedia?.id || undefined,
      parentId: values.parentId || undefined,
      isActive: values.isActive,
    };

    updateCategory(
      {
        id: category.id,
        request: request,
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  }

  // Filter out the current category from parent options to prevent self-reference
  const parentOptions = data?.data.filter((c) => c.id !== category?.id);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin danh mục bên dưới.
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
                  <FormLabel>Hình ảnh (tùy chọn)</FormLabel>
                  <div className="flex items-center gap-4">
                    {selectedMedia && (
                      <div className="relative size-24 rounded-sm overflow-hidden border">
                        <Image
                          src={getFileUrl(selectedMedia.fileUrl)}
                          alt={selectedMedia.fileName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <Button
                          size={"icon"}
                          onClick={removeImage}
                          disabled={isPending}
                          className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80 transition-colors"
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => setMediaPickerOpen(true)}
                    >
                      {selectedMedia ? "Đổi ảnh" : "Chọn ảnh"}
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên danh mục" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả danh mục"
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
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục cha (tùy chọn)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn danh mục cha" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parentOptions?.map((cat) => (
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
                      <FormLabel className="cursor-pointer">
                        Kích hoạt
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
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
                  disabled={isPending}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
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
        onSelect={(media) => setSelectedMedia(media)}
        selectedMediaId={selectedMedia?.id}
      />
    </>
  );
}
