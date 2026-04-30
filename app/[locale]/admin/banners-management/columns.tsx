"use client";

import Image from "next/image";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BannerResponse } from "@/types/banner";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DeleteBannerDialog } from "./delete-banner-dialog";
import { EditBannerDialog } from "./edit-banner-dialog";
import { getFileUrl } from "@/utils/helpers";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToggleActiveBanner } from "@/lib/hooks/use-banner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getGroupLabel = (group: BannerResponse["group"]) => {
  if (group === "Carousel") return "Băng chuyền";
  if (group === "HomePopup") return "Popup trang chủ";
  return group;
};

function ActiveSwitchCell({ row }: { row: Row<BannerResponse> }) {
  const { mutate: toggleActiveBanner, isPending } = useToggleActiveBanner();

  return (
    <Switch
      disabled={isPending}
      defaultChecked={row.original.isActive}
      onCheckedChange={() => toggleActiveBanner(row.original.id)}
    />
  );
}

function ActionsCell({ row }: { row: Row<BannerResponse> }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setEditOpen(true)}
          >
            <SquarePen />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chỉnh sửa</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Xóa</p>
        </TooltipContent>
      </Tooltip>

      <EditBannerDialog
        key={row.original.id}
        open={editOpen}
        onOpenChange={setEditOpen}
        banner={row.original}
      />

      <DeleteBannerDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        banner={row.original}
      />
    </div>
  );
}

export const columns: ColumnDef<BannerResponse>[] = [
  {
    accessorKey: "orderIndex",
    header: ({ column }) => {
      return (
        <>
          Thứ tự
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
    cell: ({ row }) => (
      <span className="font-medium">{row.original.orderIndex}</span>
    ),
  },
  {
    accessorKey: "media",
    header: "Hình ảnh",
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const media = row.original.media;
      return media ? (
        <div className="relative h-12 w-20 overflow-hidden rounded-sm">
          <Image
            src={getFileUrl(media.fileUrl)}
            alt={row.original.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">Không có ảnh</span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
  },
  {
    accessorKey: "redirectUrl",
    header: "Liên kết chuyển hướng",
    cell: ({ row }) => (
      <span
        className="max-w-48 truncate block"
        title={row.original.redirectUrl}
      >
        {row.original.redirectUrl}
      </span>
    ),
  },
  {
    accessorKey: "group",
    header: "Nhóm",
    cell: ({ row }) => (
      <Badge variant="outline">{getGroupLabel(row.original.group)}</Badge>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Kích hoạt",
    cell: ({ row }) => <ActiveSwitchCell row={row} />,
  },
  {
    accessorKey: "createdAtUtc",
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
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
