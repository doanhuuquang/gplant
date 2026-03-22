"use client";

import Image from "next/image";
import MediaResponse from "@/lib/schemas/media/media-response";
import z, { email } from "zod";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Upload, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadMedia as uploadMediaApi } from "@/services/media-service";
import { useAuth } from "@/hooks/auth/use-auth";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateProfile } from "@/hooks/user/use-update-profile";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const accountSchema = z.object({
  email: email(),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(30, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(30, "Last name is too long"),
  phoneNumber: z
    .string()
    .min(1, "Shipping phone is required")
    .max(10, "Shipping phone is invalid")
    .regex(/^0\d{9}$/, "Shipping phone is invalid"),
  profilePictureUrl: z.string(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

export default function Page() {
  const { user } = useAuth();
  const { handleUpdateProfile, isUpdatingProfile } = useUpdateProfile();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: user?.email ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      profilePictureUrl: user?.profilePictureUrl ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email ?? "",
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phoneNumber: user.phoneNumber ?? "",
        profilePictureUrl: user.profilePictureUrl ?? "",
      });
    }
  }, [user, form]);

  async function onSubmit(values: AccountFormValues) {
    let profilePictureUrl = values.profilePictureUrl;
    if (selectedFile) {
      try {
        setIsUploading(true);
        const response = await uploadMediaApi(selectedFile);
        const media = response.data as MediaResponse;
        profilePictureUrl = media.fileUrl;
        toast.success("Upload successful", {
          description: "Image has been uploaded.",
        });
      } catch {
        toast.error("Upload failed", {
          description: "Failed to upload image.",
        });
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }
    await handleUpdateProfile({
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      profilePictureUrl,
    });
    setSelectedFile(null);
  }

  const handleUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", {
        description: "Please select an image file.",
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
        <p className="text-2xl font-semibold">Profile</p>
        <p className="text-muted-foreground">General Information</p>
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
                          alt="Profile"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : field.value ? (
                        <Image
                          src={getFileUrl(field.value)}
                          alt="Profile"
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
                        Upload new image
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormLabel className="text-sm">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" disabled={true} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormLabel className="text-sm">First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
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
                <FormLabel className="text-sm">Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
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
                <FormLabel className="text-sm">Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
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
              <>
                <LoaderCircle className="animate-spin" />
                Saving...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
