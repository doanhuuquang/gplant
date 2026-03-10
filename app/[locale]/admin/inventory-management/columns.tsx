"use client";

import InventoryResponse from "@/lib/schemas/inventory/inventory-response";
import { ArrowUpDown, PackagePlus, SquarePen, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DeleteInventoryDialog } from "./delete-inventory-dialog";
import { EditInventoryDialog } from "./edit-inventory-dialog";
import { AdjustInventoryDialog } from "./adjust-inventory-dialog";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function StockStatusBadge({ inventory }: { inventory: InventoryResponse }) {
  if (inventory.isOutOfStock) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  }
  if (inventory.isLowStock) {
    return (
      <Badge
        variant="secondary"
        className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      >
        Low Stock
      </Badge>
    );
  }
  return <Badge variant="default">In Stock</Badge>;
}

function ActionsCell({ row }: { row: Row<InventoryResponse> }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setAdjustOpen(true)}
          >
            <PackagePlus />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Adjust Stock</p>
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

      <AdjustInventoryDialog
        key={`adjust-${row.original.id}`}
        open={adjustOpen}
        onOpenChange={setAdjustOpen}
        inventory={row.original}
      />

      <EditInventoryDialog
        key={`edit-${row.original.id}`}
        open={editOpen}
        onOpenChange={setEditOpen}
        inventory={row.original}
      />

      <DeleteInventoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        inventory={row.original}
      />
    </div>
  );
}

export const columns: ColumnDef<InventoryResponse>[] = [
  {
    id: "variant",
    header: "Variant (SKU)",
    accessorFn: (row) => row.plantVariant?.sku ?? "—",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.plantVariant?.sku ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "quantityAvailable",
    header: ({ column }) => {
      return (
        <>
          Available
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
      <span className="font-medium">{row.original.quantityAvailable}</span>
    ),
  },
  {
    accessorKey: "quantityReserved",
    header: "Reserved",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.quantityReserved}
      </span>
    ),
  },
  {
    accessorKey: "totalQuantity",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.totalQuantity}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StockStatusBadge inventory={row.original} />,
  },
  {
    accessorKey: "lastUpdatedAtUtc",
    header: ({ column }) => {
      return (
        <>
          Last Updated
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
      const date = new Date(row.original.lastUpdatedAtUtc);
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
