"use client";

import { LightningSaleResponse } from "@/lib/schemas/lightning-sale/lightning-sale-response";
import {
  ArrowUpDown,
  ExternalLink,
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useActivateLightningSale } from "@/hooks/lightning-sale/use-activate-lightning-sale";
import { useDeactivateLightningSale } from "@/hooks/lightning-sale/use-deactivate-lightning-sale";
import { APP_PATHS } from "@/lib/constants/app-paths";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditLightningSaleDialog } from "@/app/[locale]/admin/lightning-sales-management/edit-lightning-sale-dialog";
import { DeleteLightningSaleDialog } from "@/app/[locale]/admin/lightning-sales-management/delete-lightning-sale-dialog";

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
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function ActiveSwitchCell({ row }: { row: Row<LightningSaleResponse> }) {
  const { handleActivateLightningSale } = useActivateLightningSale();
  const { handleDeactivateLightningSale } = useDeactivateLightningSale();

  const handleToggle = async () => {
    if (row.original.isActive) {
      await handleDeactivateLightningSale(row.original.id);
    } else {
      await handleActivateLightningSale(row.original.id);
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
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
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
    header: "Status",
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
    header: "Items",
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
          Start Date
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
          End Date
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
