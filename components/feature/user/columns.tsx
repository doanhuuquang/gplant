"use client";

import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { UserResponse } from "@/types/user";
import { useState } from "react";
import { useToggleLockUser } from "@/lib/hooks/use-user";
import {
  ArrowUpDown,
  ExternalLink,
  Lock,
  LockOpen,
  MoreHorizontal,
  Shield,
  SquarePen,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditUserDialog } from "@/components/feature/user/edit-user-dialog";
import { DeleteUserDialog } from "@/components/feature/user/delete-user-dialog";
import { AssignRoleDialog } from "@/components/feature/user/assign-role-dialog";

function RolesCell({ row }: { row: Row<UserResponse> }) {
  const roles = row.original.roles;

  if (roles.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  return <span>{roles.join(", ")}</span>;
}

function ActionsCell({ row }: { row: Row<UserResponse> }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);

  const { mutate: toggleLockUser } = useToggleLockUser();

  const user = row.original;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`${APP_PATHS.USERS_MANAGEMENT}/${user.id}`}>
              <ExternalLink className="mr-2 size-4" />
              Chi tiết
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <SquarePen className="mr-2 size-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAssignRoleOpen(true)}>
            <Shield className="mr-2 size-4" />
            Gán vai trò
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => toggleLockUser(user.id)}>
            {user.isLocked ? (
              <>
                <LockOpen className="mr-2 size-4" />
                Mở khóa
              </>
            ) : (
              <>
                <Lock className="mr-2 size-4" />
                Khóa
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        key={user.id}
        open={editOpen}
        onOpenChange={setEditOpen}
        user={user}
      />

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={user}
      />

      <AssignRoleDialog
        open={assignRoleOpen}
        onOpenChange={setAssignRoleOpen}
        user={user}
      />
    </>
  );
}

export const columns: ColumnDef<UserResponse>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <>
          Email
          <Button
            variant="ghost"
            size="icon"
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
    accessorKey: "userName",
    header: ({ column }) => {
      return (
        <>
          Tên đăng nhập
          <Button
            variant="ghost"
            size="icon"
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
    id: "fullName",
    accessorFn: (row) =>
      [row.lastName, row.firstName].filter(Boolean).join(" ") || "—",
    header: ({ column }) => {
      return (
        <>
          Họ và tên
          <Button
            variant="ghost"
            size="icon"
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
    id: "roles",
    header: "Vai trò",
    cell: ({ row }) => <RolesCell row={row} />,
  },
  {
    accessorKey: "emailConfirmed",
    header: "Xác minh email",
    cell: ({ row }) => (
      <span>
        {row.original.emailConfirmed ? "Đã xác minh" : "Chưa xác minh"}
      </span>
    ),
  },
  {
    accessorKey: "isLocked",
    header: "Trạng thái",
    cell: ({ row }) => {
      const user = row.original;
      return user.isLocked ? (
        <Badge variant="destructive">
          <Lock />
          Đã khóa
        </Badge>
      ) : (
        <Badge variant="outline">
          <LockOpen />
          Hoạt động
        </Badge>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Số điện thoại",
    cell: ({ row }) => (
      <span>
        {row.original.phoneNumber || (
          <span className="text-muted-foreground">—</span>
        )}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
