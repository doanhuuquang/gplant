"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useGetUserById } from "@/hooks/user/use-get-user-by-id";
import { useAdminHeader } from "@/hooks/use-admin-header";
import { useToggleLockUser } from "@/hooks/user/use-toggle-lock-user";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Lock,
  LockOpen,
  Mail,
  MailCheck,
  MailX,
  Phone,
  PhoneMissed,
  Shield,
  ShieldMinus,
  SquarePen,
  Trash2,
  UserCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditUserDialog } from "@/app/[locale]/admin/users-management/edit-user-dialog";
import { DeleteUserDialog } from "@/app/[locale]/admin/users-management/delete-user-dialog";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { useRouter } from "next/navigation";
import { AssignRoleDialog } from "@/app/[locale]/admin/users-management/assign-role-dialog";
import { RemoveRoleDialog } from "@/app/[locale]/admin/users-management/remove-role-dialog";
import { getFileUrl } from "@/utils/helpers";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { user, isLoading, error, refetch } = useGetUserById(userId);
  const { handleToggleLockUser } = useToggleLockUser();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [removeRoleOpen, setRemoveRoleOpen] = useState(false);

  const headerActions = useMemo(
    () => (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditOpen(true)}
              className="h-12 w-12"
            >
              <SquarePen className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDeleteOpen(true)}
              className="h-12 w-12"
            >
              <Trash2 className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>

        {user && (
          <>
            <EditUserDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              user={user}
            />
            <DeleteUserDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              user={user}
              onSuccess={() => router.push(APP_PATHS.USERS_MANAGEMENT)}
            />
          </>
        )}
      </>
    ),
    [editOpen, deleteOpen, user, router],
  );

  useAdminHeader(headerActions);

  if (!user && !isLoading && !error) return null;

  return (
    <div className="flex flex-1 flex-col gap-2">
      {error && (
        <div className="rounded-sm border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-sm" />
            <Skeleton className="h-40 w-full rounded-sm" />
          </div>
          <Skeleton className="h-80 w-full rounded-sm" />
        </div>
      )}

      {!isLoading && user && (
        <div className="grid gap-2 lg:grid-cols-[1fr_350px]">
          {/* ── LEFT ─────────────────────────────── */}
          <div className="flex flex-col gap-2">
            {/* Basic info card */}
            <div className="rounded-sm border bg-card p-4">
              <h2 className="mb-5 text-sm font-semibold">Account Details</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
                  <span className="text-muted-foreground">Username</span>
                  <p className="">{user.userName}</p>
                </div>

                <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="inline-flex items-center gap-2">
                    {user.email}
                    {user.emailConfirmed ? (
                      <Badge variant="default">
                        <MailCheck />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <MailX />
                        Unverified
                      </Badge>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
                  <span className="text-muted-foreground">First Name</span>
                  <span>
                    {user.firstName || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
                  <span className="text-muted-foreground">Last Name</span>
                  <span>
                    {user.lastName || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
                  <span className="text-muted-foreground">Lock Status</span>
                  <span className="inline-flex items-center gap-2">
                    {user.isLocked ? (
                      <Badge variant="destructive">
                        <Lock />
                        Locked
                        {user.lockoutEnd && (
                          <span className="ml-1 opacity-75">
                            (until{" "}
                            {new Date(user.lockoutEnd).getFullYear() > 9000
                              ? "forever"
                              : new Intl.DateTimeFormat("vi-VN", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                  timeZone: "Asia/Ho_Chi_Minh",
                                }).format(new Date(user.lockoutEnd))}
                            )
                          </span>
                        )}
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <LockOpen />
                        Active
                      </Badge>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="inline-flex items-center gap-2">
                    {user.phoneNumber ? (
                      <>
                        {user.phoneNumber}
                        {user.phoneNumberConfirmed ? (
                          <Badge variant="default">
                            <Phone />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <PhoneMissed />
                            Unverified
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Roles card */}
            <div className="rounded-sm border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Roles</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAssignRoleOpen(true)}
                  >
                    <Shield className="mr-1.5 size-3.5" />
                    Assign
                  </Button>
                  {user.roles.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRemoveRoleOpen(true)}
                    >
                      <ShieldMinus className="mr-1.5 size-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {user.roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <Badge key={role} variant={"outline"}>
                      {role}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No roles assigned.</p>
              )}
            </div>

            {/* Actions card */}
            <div className="rounded-sm border bg-card p-4">
              <h2 className="mb-4 text-sm font-semibold">Quick Actions</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={user.isLocked ? "default" : "outline"}
                  size="sm"
                  onClick={async () => {
                    await handleToggleLockUser(user.id);
                    refetch();
                  }}
                >
                  {user.isLocked ? (
                    <>
                      <LockOpen className="mr-1.5 size-3.5" />
                      Unlock User
                    </>
                  ) : (
                    <>
                      <Lock className="mr-1.5 size-3.5" />
                      Lock User
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* ── RIGHT ────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-sm border bg-card p-4">
              <h2 className="mb-4 text-sm font-semibold">Profile</h2>

              <div className="flex flex-col items-center gap-4">
                <div className="relative size-32 overflow-hidden rounded-full border-4 border-muted bg-muted">
                  {user.profilePictureUrl ? (
                    <Image
                      src={getFileUrl(user.profilePictureUrl)}
                      alt={`${user.firstName} ${user.lastName}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <UserCircle className="size-16 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {[user.lastName, user.firstName]
                      .filter(Boolean)
                      .join(" ") || user.userName}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <Separator />

                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Email Status</span>
                    <Badge
                      variant={user.emailConfirmed ? "default" : "outline"}
                    >
                      {user.emailConfirmed ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Roles</span>
                    <span className="text-xs font-medium">
                      {user.roles.length > 0
                        ? user.roles.join(", ")
                        : "No roles"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Account</span>
                    <Badge variant={user.isLocked ? "destructive" : "outline"}>
                      {user.isLocked ? "Locked" : "Active"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Dialogs ──────────────────────────── */}
      {user && (
        <>
          <AssignRoleDialog
            open={assignRoleOpen}
            onOpenChange={(open) => {
              setAssignRoleOpen(open);
              if (!open) refetch();
            }}
            user={user}
          />

          <RemoveRoleDialog
            open={removeRoleOpen}
            onOpenChange={(open) => {
              setRemoveRoleOpen(open);
              if (!open) refetch();
            }}
            user={user}
          />
        </>
      )}
    </div>
  );
}
