"use client";

import useSignOut from "@/hooks/auth/use-sign-out";
import { LoaderCircle } from "lucide-react";
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

export function SignOutDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}) {
  const { isSigningOut, handleSignOut } = useSignOut();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent overlayClassName="z-101" className="z-102">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to sign in again to
            continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSigningOut}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Continue
            {isSigningOut && <LoaderCircle className="size-5 animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
