"use client";

import { AdjustInventoryDialog } from "./adjust-inventory-dialog";
import { ArrowUpDown, PackagePlus, SquarePen, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DeleteInventoryDialog } from "./delete-inventory-dialog";
import { EditInventoryDialog } from "./edit-inventory-dialog";
import { InventoryResponse } from "@/types/inventory";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function StockStatusBadge({ inventory }: { inventory: InventoryResponse }) {
  if (inventory.isOutOfStock) {
    return <Badge variant="destructive">Hết hàng</Badge>;
  }
  if (inventory.isLowStock) {
    return (
      <Badge
        variant="secondary"
        className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      >
        Sắp hết hàng
      </Badge>
    );
  }
  return <Badge variant="default">Còn hàng</Badge>;
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
          <p>Điều chỉnh tồn kho</p>
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

      <AdjustInventoryDialog
        open={adjustOpen}
        onOpenChange={setAdjustOpen}
        inventory={row.original}
      />

      <EditInventoryDialog
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
    header: "Biến thể (SKU)",
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
          Khả dụng
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
    header: "Đã giữ",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.quantityReserved}
      </span>
    ),
  },
  {
    accessorKey: "totalQuantity",
    header: "Tổng",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.totalQuantity}</span>
    ),
  },
  {
    id: "status",
    header: "Trạng thái",
    cell: ({ row }) => <StockStatusBadge inventory={row.original} />,
  },
  {
    accessorKey: "lastUpdatedAtUtc",
    header: ({ column }) => {
      return (
        <>
          Cập nhật gần nhất
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
    header: "Thao tác",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
