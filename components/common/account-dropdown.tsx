"use client";

import * as React from "react";
import Link from "next/link";
import UserAvatar from "@/components/common/user-avatar";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogoutDialog } from "@/components/feature/auth/logout-dialog";
import { Role } from "@/lib/enums/role";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMe } from "@/lib/hooks/use-user";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartPie,
  CreditCard,
  Gem,
  LoaderCircle,
  LogOut,
  MapPin,
  Package2,
  Smile,
  UserRound,
} from "lucide-react";

export function AccountDropdown({ className }: { className?: string }) {
  const router = useRouter();

  const [isOpenSignOutDialog, setIsOpenSignOutDialog] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const { isLoading } = useMe();
  const { user, isAuthenticated } = useAuthStore();

  if (isLoading) {
    return (
      <Button
        variant={"outline"}
        className={cn("aspect-square rounded-full bg-background", className)}
      >
        <LoaderCircle className="size-5 animate-spin" />
      </Button>
    );
  }

  return (
    <div className={className}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild className="hover:cursor-pointer">
          <Button
            variant={"outline"}
            className="aspect-square rounded-full relative overflow-hidden bg-background"
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            {!user ? (
              <UserRound className="size-5" />
            ) : (
              <span className="absolute inset-0">
                <UserAvatar />
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-56 z-101 rounded-sm"
          align="end"
          sideOffset={8}
        >
          {!user && !isAuthenticated && (
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
          )}

          {user && isAuthenticated && (
            <div className="flex items-center gap-4 p-2">
              <div className="w-10 h-10 overflow-hidden rounded-full relative border">
                <UserAvatar />
              </div>
              <div className="flex-1 truncate">
                <p>{`${user?.lastName} ${user?.firstName}`}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          )}

          {!user && !isAuthenticated && (
            <div className="flex items-center gap-2 p-2">
              <Button
                variant={"outline"}
                className="flex-1"
                onClick={() => router.push(APP_PATHS.SIGN_UP)}
              >
                Đăng ký
              </Button>
              <Button
                variant={"outline"}
                className="flex-1"
                onClick={() => router.push(APP_PATHS.SIGN_IN)}
              >
                Đăng nhập
              </Button>
            </div>
          )}
          {user && isAuthenticated && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={APP_PATHS.USER_ORDERS}>
                  <DropdownMenuItem>
                    Đơn hàng
                    <DropdownMenuShortcut>
                      <Package2 />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>

                <Link href={APP_PATHS.USER_ADDRESSES}>
                  <DropdownMenuItem>
                    Địa chỉ
                    <DropdownMenuShortcut>
                      <MapPin />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuItem>
                  Yêu thích
                  <DropdownMenuShortcut>
                    <Gem />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  Thanh toán
                  <DropdownMenuShortcut>
                    <CreditCard />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>

                <Link href={APP_PATHS.USER_ACCOUNT}>
                  <DropdownMenuItem>
                    Hồ sơ
                    <DropdownMenuShortcut>
                      <Smile />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>

                {(user.roles.includes(Role.Admin) ||
                  user.roles.includes(Role.Manager)) && (
                  <Link href={APP_PATHS.DASHBOARD}>
                    <DropdownMenuItem>
                      Bảng điều khiển
                      <DropdownMenuShortcut>
                        <ChartPie />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpenSignOutDialog(true);
                }}
              >
                Đăng xuất
                <DropdownMenuShortcut>
                  <LogOut />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <LogoutDialog
                isOpen={isOpenSignOutDialog}
                setIsOpen={setIsOpenSignOutDialog}
              />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
