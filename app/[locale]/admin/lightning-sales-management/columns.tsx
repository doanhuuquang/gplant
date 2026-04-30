"use client";

import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { ArrowUpDown, ExternalLink, SquarePen, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { LightningSaleResponse } from "@/types/lightning-sale";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditLightningSaleDialog } from "@/app/[locale]/admin/lightning-sales-management/edit-lightning-sale-dialog";
import { DeleteLightningSaleDialog } from "@/app/[locale]/admin/lightning-sales-management/delete-lightning-sale-dialog";
import {
  useActiveLightningSale,
  useDeactiveLightningSale,
} from "@/lib/hooks/use-lightning-sale";

function getSaleStatus(sale: LightningSaleResponse) {
  const now = new Date();
  const start = new Date(sale.startDateUtc);
  const end = new Date(sale.endDateUtc);

  if (now > end) return "expired";
  if (now >= start && now <= end) return "ongoing";
  if (now < start) return "upcoming";
  return "unknown";
}

function StatusBadge({ sale }: { sale: LightningSaleResponse }) {
  const status = getSaleStatus(sale);

  const statusLabels: Record<string, string> = {
    ongoing: "Đang diễn ra",
    upcoming: "Sắp diễn ra",
    expired: "Đã kết thúc",
    unknown: "Không xác định",
  };

  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    ongoing: "default",
    upcoming: "secondary",
    expired: "destructive",
    unknown: "outline",
  };

  return (
    <Badge variant={variants[status] ?? "outline"}>
      {statusLabels[status] ?? statusLabels.unknown}
    </Badge>
  );
}

function ActiveSwitchCell({ row }: { row: Row<LightningSaleResponse> }) {
  const { mutate: activateLightningSale } = useActiveLightningSale();
  const { mutate: deactivateLightningSale } = useDeactiveLightningSale();

  const handleToggle = () => {
    if (row.original.isActive) {
      activateLightningSale(row.original.id);
    } else {
      deactivateLightningSale(row.original.id);
    }
  };

  return (
    <Switch
      defaultChecked={row.original.isActive}
      onCheckedChange={handleToggle}
    />
  );
}

function ActionsCell({ row }: { row: Row<LightningSaleResponse> }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`${APP_PATHS.LIGHTNING_SALES_MANAGEMENT}/${row.original.id}`}
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

      <EditLightningSaleDialog
        key={`edit-${row.original.id}`}
        open={editOpen}
        onOpenChange={setEditOpen}
        sale={row.original}
      />

      <DeleteLightningSaleDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        sale={row.original}
      />
    </div>
  );
}

export const columns: ColumnDef<LightningSaleResponse>[] = [
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <span
        className="max-w-48 truncate block"
        title={row.original.description}
      >
        {row.original.description}
      </span>
    ),
  },
  {
    id: "status",
    header: "Trạng thái",
    accessorFn: (row) => {
      const now = new Date();
      const start = new Date(row.startDateUtc);
      const end = new Date(row.endDateUtc);
      if (now > end) return "expired";
      if (now >= start && now <= end) return "ongoing";
      if (now < start) return "upcoming";
      return "unknown";
    },
    cell: ({ row }) => <StatusBadge sale={row.original} />,
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === "active") return row.original.isActive;
      if (filterValue === "inactive") return !row.original.isActive;
      const status = row.getValue(columnId);
      return status === filterValue;
    },
  },
  {
    accessorKey: "totalItems",
    header: "Sản phẩm",
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <span>
        {row.original.activeItems}/{row.original.totalItems}
      </span>
    ),
  },
  {
    accessorKey: "startDateUtc",
    header: ({ column }) => {
      return (
        <>
          Ngày bắt đầu
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
      const date = new Date(row.original.startDateUtc);
      const formatted = new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(date);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "endDateUtc",
    header: ({ column }) => {
      return (
        <>
          Ngày kết thúc
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
      const date = new Date(row.original.endDateUtc);
      const formatted = new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
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
