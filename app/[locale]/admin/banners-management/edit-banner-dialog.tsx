"use client";

import Image from "next/image";
import { BannerGroup } from "@/lib/enums/banner-group";
import { BannerResponse, UpdateBannerRequest } from "@/types/banner";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { MediaPickerDialog } from "@/components/feature/media/media-picker-dialog";
import { MediaResponse } from "@/types/media";
import { Switch } from "@/components/ui/switch";
import { UpdateBannerRequestValidation } from "@/validations/banner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUpdateBanner } from "@/lib/hooks/use-banner";
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

const getGroupLabel = (group: BannerGroup) => {
  if (group === BannerGroup.Carousel) return "Băng chuyền";
  if (group === BannerGroup.HomePopup) return "Popup trang chủ";
  return group;
};

interface EditBannerDialogProps {
  open: boolean;
  banner: BannerResponse;
  onOpenChange: (open: boolean) => void;
}

export function EditBannerDialog({
  open,
  onOpenChange,
  banner,
}: EditBannerDialogProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaResponse | null>(
    banner.media ?? null,
  );

  const { mutate: updateBanner, isPending } = useUpdateBanner();

  type EditBannerFormValues = z.infer<typeof UpdateBannerRequestValidation>;

  const form = useForm<EditBannerFormValues>({
    resolver: zodResolver(UpdateBannerRequestValidation),
    defaultValues: {
      title: banner.title,
      description: banner.description,
      imageUrl: banner.media ? getFileUrl(banner.media.fileUrl) : "",
      redirectUrl: banner.redirectUrl,
      group: banner.group,
      orderIndex: banner.orderIndex,
      mediaId: banner.media?.id,
      isActive: banner.isActive,
    },
  });

  async function onSubmit(values: EditBannerFormValues) {
    const request: UpdateBannerRequest = {
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      redirectUrl: values.redirectUrl,
      group: values.group as BannerGroup,
      orderIndex: values.orderIndex,
      mediaId: selectedMedia?.id,
      isActive: values.isActive,
    };

    updateBanner(
      {
        id: banner.id,
        request: request,
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa banner</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin banner bên dưới.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col flex-1 overflow-hidden gap-4"
            >
              <div className="flex-1 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* Media picker */}
                <div className="space-y-2">
                  <FormLabel>Hình ảnh</FormLabel>
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => setMediaPickerOpen(true)}
                  >
                    {selectedMedia && (
                      <div className="relative h-20 w-32 overflow-hidden rounded-sm border">
                        <Image
                          src={getFileUrl(selectedMedia.fileUrl)}
                          alt="Hình banner"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <Button type="button" variant="outline">
                      {selectedMedia ? "Đổi ảnh" : "Chọn ảnh"}
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input placeholder="Tiêu đề banner" {...field} />
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
                        <Input placeholder="Mô tả banner" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="redirectUrl"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Liên kết chuyển hướng</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="group"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhóm</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
                            <SelectValue placeholder="Chọn nhóm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(BannerGroup).map((group) => (
                            <SelectItem key={group} value={group}>
                              {getGroupLabel(group)}
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
                  name="orderIndex"
                  disabled={isPending}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thứ tự hiển thị</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Vị trí hiển thị"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(
                              val === "" ? undefined : Number(val),
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  disabled={isPending}
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
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
                >
                  {isPending && (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  )}
                  Lưu
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={(media) => {
          setSelectedMedia(media);
          form.setValue("imageUrl", getFileUrl(media.fileUrl), {
            shouldValidate: true,
          });
          form.setValue("mediaId", media.id);
          setMediaPickerOpen(false);
        }}
        selectedMediaId={selectedMedia?.id}
      />
    </>
  );
}
