"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUpdateBanner } from "@/hooks/banner/use-update-banner";
import { BannerGroup } from "@/lib/enums/banner-group";
import { MediaPickerDialog } from "@/components/shared/media-picker-dialog";
import { useState } from "react";
import { getFileUrl } from "@/utils/helpers";
import MediaResponse from "@/lib/schemas/media/media-response";
import BannerResponse from "@/lib/schemas/banner/banner-response";

const editBannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  redirectUrl: z.string().min(1, "Redirect URL is required"),
  group: z.string().min(1, "Group is required"),
  orderIndex: z.number().int().positive().optional(),
  isActive: z.boolean(),
});

type EditBannerFormValues = z.infer<typeof editBannerSchema>;

interface EditBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: BannerResponse;
}

export function EditBannerDialog({
  open,
  onOpenChange,
  banner,
}: EditBannerDialogProps) {
  const { handleUpdateBanner, isLoading } = useUpdateBanner();
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaResponse | null>(
    banner.media ?? null,
  );

  const form = useForm<EditBannerFormValues>({
    resolver: zodResolver(editBannerSchema),
    defaultValues: {
      title: banner.title,
      redirectUrl: banner.redirectUrl,
      group: banner.group,
      orderIndex: banner.orderIndex,
      isActive: banner.isActive,
    },
  });

  async function onSubmit(values: EditBannerFormValues) {
    const success = await handleUpdateBanner(banner.id, {
      title: values.title,
      redirectUrl: values.redirectUrl,
      group: values.group as BannerGroup,
      orderIndex: values.orderIndex,
      mediaId: selectedMedia?.id,
      isActive: values.isActive,
    });

    if (success) {
      onOpenChange(false);
    }
  }

  const busy = isLoading;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Update the banner details below.
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
                  <FormLabel>Image</FormLabel>
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => setMediaPickerOpen(true)}
                  >
                    {selectedMedia ? (
                      <div className="relative h-20 w-32 overflow-hidden rounded-sm border">
                        <Image
                          src={getFileUrl(selectedMedia.fileUrl)}
                          alt="Banner image"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-32 items-center justify-center rounded-sm border border-dashed text-muted-foreground text-sm">
                        Select image
                      </div>
                    )}
                    <Button type="button" variant="outline" size="sm">
                      {selectedMedia ? "Change" : "Browse"}
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  disabled={busy}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Banner title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="redirectUrl"
                  disabled={busy}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Redirect URL</FormLabel>
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
                  disabled={busy}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={busy}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12! shadow-none rounded-sm">
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(BannerGroup).map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
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
                  disabled={busy}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Index</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Order position"
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
                  disabled={busy}
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
                  Save
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
          setMediaPickerOpen(false);
        }}
        selectedMediaId={selectedMedia?.id}
      />
    </>
  );
}
