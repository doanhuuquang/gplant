"use client";

import Image from "next/image";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFileUrl } from "@/utils/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminHeader } from "@/lib/hooks/use-admin-header";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useToggleLockUser, useUser } from "@/lib/hooks/use-user";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Lock,
  LockOpen,
  Phone,
  PhoneMissed,
  Plus,
  SquarePen,
  Trash2,
  UserCircle,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditUserDialog } from "@/components/feature/user/edit-user-dialog";
import { DeleteUserDialog } from "@/components/feature/user/delete-user-dialog";
import { AssignRoleDialog } from "@/components/feature/user/assign-role-dialog";
import { RemoveRoleDialog } from "@/components/feature/user/remove-role-dialog";
import { UserResponse } from "@/types/user";

function AccountDetails({ user }: { user: UserResponse }) {
  return (
    <div className="rounded-sm border bg-card p-4">
      <h2 className="text-lg mb-5 font-semibold">Thông tin tài khoản</h2>

      <div className="space-y-4">
        <div className="relative size-32 overflow-hidden rounded-full bg-gray-300/20">
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
              <UserCircle className="size-16 text-gray-300" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
          <span className="text-muted-foreground">Tên đăng nhập</span>
          <p className="">{user.userName}</p>
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
          <span className="text-muted-foreground">Email</span>
          <span className="inline-flex items-center gap-2">
            {user.email}
            {user.emailConfirmed ? (
              <Badge variant="default">Đã xác minh</Badge>
            ) : (
              <Badge variant="outline">Chưa xác minh</Badge>
            )}
          </span>
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
          <span className="text-muted-foreground">Tên</span>
          <span>
            {user.firstName || <span className="text-muted-foreground">—</span>}
          </span>
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
          <span className="text-muted-foreground">Họ</span>
          <span>
            {user.lastName || <span className="text-muted-foreground">—</span>}
          </span>
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
          <span className="text-muted-foreground">Trạng thái khóa</span>
          <span className="inline-flex items-center gap-2">
            {user.isLocked ? (
              <Badge variant="destructive">
                <Lock />
                Đã khóa
                {user.lockoutEnd && (
                  <span className="ml-1 opacity-75">
                    (đến{" "}
                    {new Date(user.lockoutEnd).getFullYear() > 9000
                      ? "vĩnh viễn"
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
                Đang hoạt động
              </Badge>
            )}
          </span>
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 text-sm">
          <span className="text-muted-foreground">Số điện thoại</span>
          <span className="inline-flex items-center gap-2">
            {user.phoneNumber ? (
              <>
                {user.phoneNumber}
                {user.phoneNumberConfirmed ? (
                  <Badge variant="default">
                    <Phone />
                    Đã xác minh
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <PhoneMissed />
                    Chưa xác minh
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
  );
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignRoleOpen, setAssignRoleOpen] = useState(false);
  const [removeRoleOpen, setRemoveRoleOpen] = useState(false);

  const { data, isLoading, error, refetch } = useUser(userId);
  const { mutate: toogleLockUser } = useToggleLockUser();

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
            <p>Chỉnh sửa</p>
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
            <p>Xóa</p>
          </TooltipContent>
        </Tooltip>

        {data?.data && (
          <>
            <EditUserDialog
              open={editOpen}
              onOpenChange={setEditOpen}
              user={data.data}
            />
            <DeleteUserDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              user={data.data}
              onSuccess={() => router.push(APP_PATHS.USERS_MANAGEMENT)}
            />
          </>
        )}
      </>
    ),
    [editOpen, deleteOpen, data, router],
  );

  useAdminHeader(headerActions);

  if (!data && !isLoading && !error) return null;

  return (
    <div className="flex flex-1 flex-col gap-2">
      {error && (
        <div className="rounded-sm border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
          {error.message}
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

      {!isLoading && data?.data && (
        <div className="grid gap-2 lg:grid-cols-[1fr_350px]">
          <AccountDetails user={data.data} />

          <div className="flex flex-col gap-2 lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-sm border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Vai trò</h2>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size={"sm"}
                    onClick={() => setAssignRoleOpen(true)}
                  >
                    <Plus />
                    Thêm
                  </Button>
                </div>
              </div>

              {data?.data.roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data?.data.roles.map((role) => (
                    <div key={role}>
                      <div className="px-4 py-2 rounded-sm border flex items-center gap-3">
                        <p>{role}</p>
                        <div
                          onClick={() => setRemoveRoleOpen(true)}
                          className="bg-destructive w-4 h-4 rounded-full cursor-pointer flex items-center justify-center"
                        >
                          <X className="text-white size-3" />
                        </div>
                      </div>

                      <RemoveRoleDialog
                        open={removeRoleOpen}
                        onOpenChange={(open) => {
                          setRemoveRoleOpen(open);
                          if (!open) refetch();
                        }}
                        user={data?.data}
                        role={role}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Chưa gán vai trò nào.</p>
              )}
            </div>

            <div className="rounded-sm border bg-card p-4">
              <h2 className="text-lg mb-4 font-semibold">Thao tác nhanh</h2>
              <div className="flex items-center justify-between space-x-2">
                <Switch
                  defaultChecked={data?.data.isLocked}
                  onCheckedChange={() => {
                    toogleLockUser(data?.data.id);
                    refetch();
                  }}
                  id="airplane-mode"
                />
                <Label htmlFor="airplane-mode">
                  {data?.data.isLocked ? "Mở khóa" : "Khóa"}
                </Label>
              </div>
            </div>
          </div>
        </div>
      )}

      {data?.data && (
        <>
          <AssignRoleDialog
            open={assignRoleOpen}
            onOpenChange={(open) => {
              setAssignRoleOpen(open);
              if (!open) refetch();
            }}
            user={data?.data}
          />
        </>
      )}
    </div>
  );
}
