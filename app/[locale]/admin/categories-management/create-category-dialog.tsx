"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CreateCategoryRequest } from "@/types/category";
import { CreateCategoryRequestValidation } from "@/validations/category";
import { getFileUrl } from "@/utils/helpers";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MediaPickerDialog } from "@/components/feature/media/media-picker-dialog";
import { MediaResponse } from "@/types/media";
import { Textarea } from "@/components/ui/textarea";
import { useCategories, useCreateCategory } from "@/lib/hooks/use-category";
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

type CreateCategoryFormValues = z.infer<typeof CreateCategoryRequestValidation>;

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaResponse | null>(
    null,
  );
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const { mutate: creatCategory, isPending } = useCreateCategory();
  const { data } = useCategories();

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(CreateCategoryRequestValidation),
    defaultValues: {
      name: "",
      description: "",
      mediaId: undefined,
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
    const request: CreateCategoryRequest = {
      name: values.name,
      description: values.description,
      mediaId: selectedMedia?.id,
      parentId: values.parentId || undefined,
    };

    creatCategory(request, {
      onSuccess: () => {
        resetForm();
        onOpenChange(false);
      },
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Tạo danh mục</DialogTitle>
            <DialogDescription>
              Điền thông tin bên dưới để tạo danh mục mới.
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
                          disabled={isPending}
                          className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80 transition-colors"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setMediaPickerOpen(true)}
                        disabled={isPending}
                        className="flex size-24 flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-muted-foreground/50 text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                      >
                        <ImagePlus className="size-6" />
                        <span className="text-xs">Chọn</span>
                      </button>
                    )}
                    {selectedMedia && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => setMediaPickerOpen(true)}
                      >
                        Đổi ảnh
                      </Button>
                    )}
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
                          {data?.data.map((category) => (
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
                  disabled={isPending}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
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
        onSelect={(media) => setSelectedMedia(media)}
        selectedMediaId={selectedMedia?.id}
      />
    </>
  );
}
