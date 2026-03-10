import * as React from "react";

import { ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { signOut } from "@/services/account-service";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/use-auth";
import { useRouter } from "next/navigation";

export default function useSignOut() {
  const { refresh } = useAuth();
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = React.useState<boolean>(false);
  const [signOutError, setSignOutError] = React.useState<string | null>(null);
  const [isSignOutSuccess, setIsSignOutSuccess] =
    React.useState<boolean>(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      setSignOutError(null);
      setIsSignOutSuccess(false);

      await signOut();

      setIsSignOutSuccess(true);

      toast.success("Signed out", {
        description: "You have been signed out successfully.",
      });

      refresh();
      router.refresh();
    } catch (e) {
      const err = e as ApiErrorResponse;
      setSignOutError(err.message);

      toast.error("Oh no! Something's wrong!", {
        description: err.message,
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return {
    isSigningOut,
    isSignOutSuccess,
    signOutError,
    handleSignOut,
  };
}
