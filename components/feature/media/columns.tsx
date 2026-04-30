"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpDown, LoaderCircle, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { getFileUrl } from "@/utils/helpers";
import { MediaResponse } from "@/types/media";
import { useDeleteMedia } from "@/lib/hooks/use-media";
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
  const [isShowDeleteDialog, setIsShowDeleteDialog] =
    React.useState<boolean>(false);

  const { mutate: deleteMedia, isPending } = useDeleteMedia();

  const handleDelete = () => {
    deleteMedia(row.original.id, {
      onSuccess: () => setIsShowDeleteDialog(false),
    });
  };

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
          <p>Xóa</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Xóa media</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xóa &quot;{row.original.fileName}&quot; không? Hành
            động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild disabled={isPending}>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && <LoaderCircle className="animate-spin" />}
            Xóa
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
          Tên tệp
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
        <Dialog>
          <DialogTrigger asChild>
            <Image
              src={getFileUrl(row.original.fileUrl)}
              alt={row.original.fileName}
              width={50}
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
      );
    },
  },
  {
    accessorKey: "fileSize",
    header: "Dung lượng tệp",
    cell: ({ row }) => {
      const bytes = Number(row.original.fileSize);
      if (bytes < 1024) return <div>{bytes} B</div>;
      if (bytes < 1024 * 1024) return <div>{(bytes / 1024).toFixed(2)} KB</div>;
      return <div>{(bytes / (1024 * 1024)).toFixed(2)} MB</div>;
    },
  },
  {
    accessorKey: "mimeType",
    header: "Loại tệp",
  },
  {
    accessorKey: "uploadedBy",
    header: "Đăng tải bởi",
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
          Ngày tạo
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
    header: "Thao tác",
    cell: ({ row }) => <DeleteButtonCell row={row} />,
  },
];
