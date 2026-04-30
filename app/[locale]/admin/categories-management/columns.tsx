"use client";

import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { ArrowUpDown, ExternalLink, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryResponse } from "@/types/category";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useCategoryById,
  useToggleActiveCategory,
} from "@/lib/hooks/use-category";

function ActiveSwitchCell({ row }: { row: Row<CategoryResponse> }) {
  const { mutate: toggleActiveCategory, isPending } = useToggleActiveCategory();

  return (
    <Switch
      disabled={isPending}
      defaultChecked={row.original.isActive}
      onCheckedChange={() => toggleActiveCategory(row.original.id)}
    />
  );
}

function ParentCategoryCell({ row }: { row: Row<CategoryResponse> }) {
  const { data } = useCategoryById(row.original.parentId || "");

  return <p>{data?.data?.name ?? "_"}</p>;
}

function ActionsCell({ row }: { row: Row<CategoryResponse> }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`${APP_PATHS.CATEGORIES_MANAGEMENT}/${row.original.slug}`}
          >
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

      <EditCategoryDialog
        key={row.original.id}
        open={editOpen}
        onOpenChange={setEditOpen}
        category={row.original}
      />

      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={row.original}
      />
    </>
  );
}

export const columns: ColumnDef<CategoryResponse>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <>
          Tên danh mục
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
    accessorKey: "description",
    header: "Mô tả",
  },
  {
    id: "parentName",
    header: "Danh mục cha",
    cell: ({ row }) => <ParentCategoryCell row={row} />,
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
