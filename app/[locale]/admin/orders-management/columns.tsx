"use client";

import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { ArrowUpDown, ExternalLink, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderResponse } from "@/types/order";
import Image from "next/image";
import { getFileUrl } from "@/utils/helpers";
import { EditOrderDialog } from "@/app/[locale]/admin/orders-management/edit-order-dialog";

function ActionsCell({ row }: { row: Row<OrderResponse> }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`${APP_PATHS.ORDERS_MANAGEMENT}/${row.original.orderNumber}`}
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

      <EditOrderDialog
        key={row.original.id}
        open={editOpen}
        onOpenChange={setEditOpen}
        order={row.original}
      />
    </>
  );
}

export const columns: ColumnDef<OrderResponse>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => {
      return (
        <>
          Mã đơn hàng
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
    accessorKey: "user",
    header: "Người đặt hàng",
    cell: ({ row }) => {
      return (
        <div className="w-full flex items-center gap-2">
          <div className="w-fit h-fit border rounded-full overflow-hidden">
            <Image
              src={getFileUrl(row.original.user.profilePictureUrl)}
              alt=""
              width={30}
              height={30}
            />
          </div>
          <p>
            {row.original.user.lastName} {row.original.user.firstName}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => {
      return (
        <div className="w-full max-w-30 truncate">{row.original.address}</div>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <>
          Đơn giá
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
      <p>
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(row.original.total)}
      </p>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "PTTT",
    cell: ({ row }) => <p>{row.original.paymentMethodDisplay}</p>,
  },
  {
    accessorKey: "createdAtUtc",
    header: ({ column }) => {
      return (
        <>
          Ngày đặt
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
        dateStyle: "short",
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
