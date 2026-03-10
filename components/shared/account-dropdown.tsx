"use client";
import * as React from "react";
import UserAvatar from "@/components/shared/auth/user-avatar";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/auth/use-auth";
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
import { Role } from "@/lib/enums/role";
import Link from "next/link";
import { SignOutDialog } from "@/components/shared/auth/sign-out-dialog";

export function AccountDropdown({ className }: { className?: string }) {
  const rounter = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [isOpenSignOutDialog, setIsOpenSignOutDialog] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  if (isLoading) {
    return (
      <Button
        variant={"outline"}
        className={cn("aspect-square rounded-full", className)}
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
            className="aspect-square rounded-full relative overflow-hidden"
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
          {!user && !isLoggedIn && (
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
          )}

          {user && isLoggedIn && (
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

          {!user && !isLoggedIn && (
            <div className="flex items-center gap-2 p-2">
              <Button
                variant={"outline"}
                className="flex-1"
                onClick={() => rounter.push(APP_PATHS.SIGN_UP)}
              >
                Sign Up
              </Button>
              <Button
                variant={"outline"}
                className="flex-1"
                onClick={() => rounter.push(APP_PATHS.SIGN_IN)}
              >
                Sign In
              </Button>
            </div>
          )}
          {user && isLoggedIn && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Orders
                  <DropdownMenuShortcut>
                    <Package2 />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Address
                  <DropdownMenuShortcut>
                    <MapPin />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Whishlist
                  <DropdownMenuShortcut>
                    <Gem />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Payments
                  <DropdownMenuShortcut>
                    <CreditCard />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Profile
                  <DropdownMenuShortcut>
                    <Smile />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                {(user.roles.includes(Role.Admin) ||
                  user.roles.includes(Role.Manager)) && (
                  <Link href={APP_PATHS.DASHBOARD}>
                    <DropdownMenuItem>
                      Dashboard
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
                Log out
                <DropdownMenuShortcut>
                  <LogOut />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <SignOutDialog
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
