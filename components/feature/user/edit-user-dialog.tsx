"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/utils/helpers";
import { ImagePlus, LoaderCircle, Trash2, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MediaPickerDialog } from "@/components/feature/media/media-picker-dialog";
import { UpdateUserRequest, UserResponse } from "@/types/user";
import { UpdateUserRequestValidation } from "@/validations/user";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUpdateUser } from "@/lib/hooks/use-user";
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

interface EditUserDialogProps {
  open: boolean;
  user: UserResponse;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
}: EditUserDialogProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const { mutate: updateUser, isPending } = useUpdateUser();

  const form = useForm<UpdateUserRequest>({
    resolver: zodResolver(UpdateUserRequestValidation),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber ?? "",
      profilePictureUrl: user.profilePictureUrl ?? "",
    },
  });

  async function onSubmit(values: UpdateUserRequest) {
    const request: UpdateUserRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      profilePictureUrl: values.profilePictureUrl,
    };

    updateUser(
      { id: user.id, request: request },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin người dùng <strong>{user.email}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="profilePictureUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh đại diện</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-muted bg-muted">
                        {field.value ? (
                          <Image
                            src={getFileUrl(field.value)}
                            alt="Ảnh đại diện"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <UserCircle className="size-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setMediaPickerOpen(true)}
                        >
                          <ImagePlus className="" />
                          {field.value ? "Thay đổi" : "Chọn"}
                        </Button>
                        {field.value && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => field.onChange("")}
                          >
                            <Trash2 className="" />
                            Xóa
                          </Button>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MediaPickerDialog
              open={mediaPickerOpen}
              onOpenChange={setMediaPickerOpen}
              onSelect={(media) => {
                form.setValue("profilePictureUrl", media.fileUrl);
              }}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
