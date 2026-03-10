"use client";

import BannerResponse from "@/lib/schemas/banner/banner-response";
import Image from "next/image";
import { ArrowUpDown, SquarePen, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DeleteBannerDialog } from "./delete-banner-dialog";
import { EditBannerDialog } from "./edit-banner-dialog";
import { getFileUrl } from "@/utils/helpers";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToggleActiveBanner } from "@/hooks/banner/use-toggle-active-banner";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ActiveSwitchCell({ row }: { row: Row<BannerResponse> }) {
  const { handleToggleActiveBanner } = useToggleActiveBanner();
  return (
    <Switch
      defaultChecked={row.original.isActive}
      onCheckedChange={() => handleToggleActiveBanner(row.original.id)}
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
          <p>Edit</p>
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
          <p>Delete</p>
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
          Order
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
    header: "Image",
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
        <span className="text-muted-foreground text-sm">No image</span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "redirectUrl",
    header: "Redirect URL",
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
    header: "Group",
    cell: ({ row }) => <Badge variant="outline">{row.original.group}</Badge>,
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <ActiveSwitchCell row={row} />,
  },
  {
    accessorKey: "createdAtUtc",
    header: ({ column }) => {
      return (
        <>
          Created At
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
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
