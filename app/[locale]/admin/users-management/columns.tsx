"use client";

import UserResponse from "@/lib/schemas/user/user-response";
import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";
import {
  ArrowUpDown,
  ExternalLink,
  Lock,
  LockOpen,
  MoreHorizontal,
  Shield,
  ShieldMinus,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { useToggleLockUser } from "@/hooks/user/use-toggle-lock-user";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditUserDialog } from "@/app/[locale]/admin/users-management/edit-user-dialog";
import { DeleteUserDialog } from "@/app/[locale]/admin/users-management/delete-user-dialog";
import { AssignRoleDialog } from "@/app/[locale]/admin/users-management/assign-role-dialog";
import { RemoveRoleDialog } from "@/app/[locale]/admin/users-management/remove-role-dialog";

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
  const [removeRoleOpen, setRemoveRoleOpen] = useState(false);
  const { handleToggleLockUser } = useToggleLockUser();

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
              Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <SquarePen className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAssignRoleOpen(true)}>
            <Shield className="mr-2 size-4" />
            Assign Role
          </DropdownMenuItem>
          {user.roles.length > 0 && (
            <DropdownMenuItem onClick={() => setRemoveRoleOpen(true)}>
              <ShieldMinus className="mr-2 size-4" />
              Remove Role
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleToggleLockUser(user.id)}>
            {user.isLocked ? (
              <>
                <LockOpen className="mr-2 size-4" />
                Unlock
              </>
            ) : (
              <>
                <Lock className="mr-2 size-4" />
                Lock
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Delete
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

      <RemoveRoleDialog
        open={removeRoleOpen}
        onOpenChange={setRemoveRoleOpen}
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
          Username
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
          Full Name
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
    header: "Roles",
    cell: ({ row }) => <RolesCell row={row} />,
  },
  {
    accessorKey: "emailConfirmed",
    header: "Email Verified",
    cell: ({ row }) => (
      <span>{row.original.emailConfirmed ? "Verified" : "Unverified"}</span>
    ),
  },
  {
    accessorKey: "isLocked",
    header: "Status",
    cell: ({ row }) => {
      const user = row.original;
      return user.isLocked ? (
        <Badge variant="destructive">
          <Lock />
          Locked
        </Badge>
      ) : (
        <Badge variant="outline">
          <LockOpen />
          Active
        </Badge>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
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
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
