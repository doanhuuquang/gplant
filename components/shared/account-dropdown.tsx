"use client";
import UserAvatar from "@/components/shared/auth/user-avatar";
import useSignOut from "@/hooks/auth/use-sign-out";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/auth/use-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CreditCard,
  Gem,
  LoaderCircle,
  LogOut,
  MapPin,
  Package2,
  Smile,
  UserRound,
} from "lucide-react";

export function SignOutDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const { isSigningOut, handleSignOut } = useSignOut();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        Log out
        <DropdownMenuShortcut>
          <LogOut />
        </DropdownMenuShortcut>
      </DropdownMenuItem>
      <AlertDialogContent overlayClassName="z-101" className="z-102">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSigningOut}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isSigningOut} onClick={handleSignOut}>
            Continue
            {isSigningOut && <LoaderCircle className="size-5 animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AccountDropdown({ className }: { className?: string }) {
  const rounter = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            {!user ? <UserRound className="size-5" /> : <UserAvatar />}
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
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <SignOutDialog />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
