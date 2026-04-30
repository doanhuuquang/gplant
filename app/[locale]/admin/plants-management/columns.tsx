"use client";

import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { ArrowUpDown, ExternalLink, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { PlantResponse } from "@/types/plant";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToggleActivePlantVariant } from "@/lib/hooks/use-plant";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditPlantDialog } from "@/app/[locale]/admin/plants-management/edit-plant-dialog";
import { DeletePlantDialog } from "@/app/[locale]/admin/plants-management/delete-plant-dialog";

function ActiveSwitchCell({ row }: { row: Row<PlantResponse> }) {
  const { mutate: toggleActivePlant } = useToggleActivePlantVariant();
  return (
    <Switch
      defaultChecked={row.original.isActive}
      onCheckedChange={() => toggleActivePlant(row.original.id)}
    />
  );
}

function PriceRangeCell({ row }: { row: Row<PlantResponse> }) {
  const { minPrice, maxPrice } = row.original;

  if (minPrice == null && maxPrice == null) {
    return <span className="text-muted-foreground">—</span>;
  }

  const fmt = (v: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v);

  if (minPrice === maxPrice) {
    return <span>{fmt(minPrice!)}</span>;
  }

  return (
    <span>
      {fmt(minPrice!)} – {fmt(maxPrice!)}
    </span>
  );
}

function ActionsCell({ row }: { row: Row<PlantResponse> }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`${APP_PATHS.PLANTS_MANAGEMENT}/${row.original.slug}`}>
            <Button variant={"ghost"} size={"icon"}>
              <ExternalLink />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chi tiết</p>
        </TooltipContent>
      </Tooltip>

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

      <EditPlantDialog
        key={row.original.id}
        open={editOpen}
        onOpenChange={setEditOpen}
        plant={row.original}
      />

      <DeletePlantDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        plant={row.original}
      />
    </>
  );
}

export const columns: ColumnDef<PlantResponse>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <>
          Tên cây
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
  },
  {
    accessorKey: "shortDescription",
    header: "Mô tả ngắn",
    cell: ({ row }) => (
      <p className="truncate max-w-25">{row.original.shortDescription}</p>
    ),
  },
  {
    id: "categoryName",
    accessorFn: (row) => row.category?.name ?? "—",
    header: ({ column }) => {
      return (
        <>
          Danh mục
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
  },
  {
    id: "priceRange",
    header: "Khoảng giá",
    cell: ({ row }) => <PriceRangeCell row={row} />,
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
    accessorKey: "isActive",
    header: "Kích hoạt",
    cell: ({ row }) => <ActiveSwitchCell row={row} />,
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
