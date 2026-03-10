"use client";

import * as React from "react";
import Image from "next/image";
import { getFileUrl } from "@/utils/helpers";
import MediaResponse from "@/lib/schemas/media/media-response";
import { ArrowUpDown, LoaderCircle, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useDeleteMedia } from "@/hooks/media/use-delete-media";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function DeleteButtonCell({ row }: { row: Row<MediaResponse> }) {
  const { handleDeleteMedia, isDeletingMedia } = useDeleteMedia();
  const [isShowDeleteDialog, setIsShowDeleteDialog] =
    React.useState<boolean>(false);

  return (
    <Dialog open={isShowDeleteDialog} onOpenChange={setIsShowDeleteDialog}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Trash2 className="text-destructive" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Media</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{row.original.fileName}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild disabled={isDeletingMedia}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={async () => {
              const success = await handleDeleteMedia(row.original.id);
              if (success) setIsShowDeleteDialog(false);
            }}
            disabled={isDeletingMedia}
          >
            {isDeletingMedia && <LoaderCircle className="animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const columns: ColumnDef<MediaResponse>[] = [
  {
    accessorKey: "fileName",
    header: ({ column }) => {
      return (
        <>
          File Name
          <Button
            variant="ghost"
            size={"icon"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            <ArrowUpDown />
          </Button>
        </>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Image
                src={getFileUrl(row.original.fileUrl)}
                alt={row.original.fileName}
                width={100}
                height={40}
                unoptimized
                className="rounded-sm cursor-pointer"
              />
            </DialogTrigger>
            <DialogContent className="lg:max-w-3xl! max-h-[90vh] flex flex-col overflow-hidden">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription>{row.original.fileName}</DialogDescription>
              </DialogHeader>
              <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
                <Image
                  src={getFileUrl(row.original.fileUrl)}
                  alt={row.original.fileName}
                  width={1200}
                  height={800}
                  unoptimized
                  className="max-w-full max-h-[calc(90vh-8rem)] object-contain rounded-sm"
                />
              </div>
            </DialogContent>
          </Dialog>
          <p className="">{row.original.fileName}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "fileSize",
    header: "File Size",
    cell: ({ row }) => {
      const bytes = Number(row.original.fileSize);
      if (bytes < 1024) return <div>{bytes} B</div>;
      if (bytes < 1024 * 1024) return <div>{(bytes / 1024).toFixed(2)} KB</div>;
      return <div>{(bytes / (1024 * 1024)).toFixed(2)} MB</div>;
    },
  },
  {
    accessorKey: "mimeType",
    header: "Mime Type",
  },
  {
    accessorKey: "uploadedBy",
    header: "Uploaded By",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={getFileUrl(row.original.uploadedBy.profilePictureUrl)}
            />
            <AvatarFallback>
              {row.original.uploadedBy.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <p>{`${row.original.uploadedBy.lastName} ${row.original.uploadedBy.firstName}`}</p>
        </div>
      );
    },
  },
  {
    id: "createdAtUtc",
    accessorFn: (row) => new Date(row.createdAtUtc).getTime(),
    header: ({ column }) => {
      return (
        <>
          Created Date
          <Button
            variant="ghost"
            size={"icon"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent"
          >
            <ArrowUpDown />
          </Button>
        </>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAtUtc);
      const formatted = new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(date);

      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DeleteButtonCell row={row} />,
  },
];
