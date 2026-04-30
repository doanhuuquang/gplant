"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Upload, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { UpdateUserRequest } from "@/types/user";
import { UpdateUserRequestValidation } from "@/validations/user";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateProfile } from "@/lib/hooks/use-user";
import { useUploadMedia } from "@/lib/hooks/use-media";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Page() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading] = useState(false);

  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const { mutate: uploadMedia } = useUploadMedia("");

  const form = useForm<UpdateUserRequest>({
    resolver: zodResolver(UpdateUserRequestValidation),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      profilePictureUrl: user?.profilePictureUrl ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phoneNumber: user.phoneNumber ?? "",
        profilePictureUrl: user.profilePictureUrl ?? "",
      });
    }
  }, [user, form]);

  async function onSubmit(values: UpdateUserRequest) {
    if (selectedFile) {
      uploadMedia(selectedFile, {
        onSuccess: (response) => {
          const request: UpdateUserRequest = {
            ...values,
            profilePictureUrl: response.data.fileUrl,
          };
          updateProfile(request);
          setSelectedFile(null);
        },
      });
    } else {
      updateProfile(values);
      setSelectedFile(null);
    }
  }

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Tệp không hợp lệ", {
        description: "Vui lòng chọn tệp hình ảnh.",
      });
      return;
    }
    setSelectedFile(file);
    form.setValue("profilePictureUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-10">
      <div>
        <p className="text-2xl font-semibold">Hồ sơ</p>
        <p className="text-muted-foreground">Thông tin chung</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid lg:grid-cols-3 gap-4"
        >
          <FormField
            control={form.control}
            name="profilePictureUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-end gap-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-muted bg-muted">
                      {selectedFile ? (
                        <Image
                          src={URL.createObjectURL(selectedFile)}
                          alt="Ảnh đại diện"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : field.value ? (
                        <Image
                          src={getFileUrl(field.value)}
                          alt="Ảnh đại diện"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <UserCircle className="size-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="w-full flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        {isUploading ? (
                          <LoaderCircle className="mr-2 size-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 size-4" />
                        )}
                        Tải ảnh mới
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadNew}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className="gap-1">
            <FormLabel className="text-sm">Email</FormLabel>
            <FormControl>
              <Input placeholder="Email" disabled={true} value={user?.email} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormLabel className="text-sm">Tên</FormLabel>
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
              <FormItem className="gap-1">
                <FormLabel className="text-sm">Họ</FormLabel>
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
              <FormItem className="gap-1">
                <FormLabel className="text-sm">Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isUpdatingProfile || !form.formState.isValid}
            className="mt-auto"
          >
            {isUpdatingProfile ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Cập nhật"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
