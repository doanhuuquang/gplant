"use client";

import CategoryResponse from "@/lib/schemas/category/category-response";
import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { ArrowUpDown, ExternalLink, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";
import { Switch } from "@/components/ui/switch";
import { useGetCategoryById } from "@/hooks/category/use-get-category-by-id";
import { useState } from "react";
import { useToggleActiveCategory } from "@/hooks/category/use-toggle-active-category";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ActiveSwitchCell({ row }: { row: Row<CategoryResponse> }) {
  const { handleToggleActiveCategory } = useToggleActiveCategory();
  return (
    <Switch
      defaultChecked={row.original.isActive}
      onCheckedChange={() => handleToggleActiveCategory(row.original.id)}
    />
  );
}

function ParentCategoryCell({ row }: { row: Row<CategoryResponse> }) {
  const { categoryById } = useGetCategoryById(row.original.parentId);

  return <p>{categoryById?.name ?? "_"}</p>;
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
          <p>Details</p>
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
          Category Name
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
    header: "Description",
  },
  {
    id: "parentName",
    header: "Parent Category",
    cell: ({ row }) => <ParentCategoryCell row={row} />,
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
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <ActiveSwitchCell row={row} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
