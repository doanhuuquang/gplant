import { signInWithEmailAndPassword } from "@/services/account-service";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth/use-auth";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { type SignInRequest } from "@/lib/schemas/auth/signin-request";

export default function useSignIn() {
  const t = useTranslations("Errors");

  const { refresh } = useAuth();

  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSignInSuccess, setIsSignInSuccess] = useState<boolean>(false);

  const signIn = async (data: SignInRequest) => {
    try {
      setIsSigningIn(true);
      setSignInError(null);
      setIsSignInSuccess(false);

      await signInWithEmailAndPassword(data);

      setIsSignInSuccess(true);

      toast.success("Signed in", {
        description: "You have been signed in successfully.",
      });

      refresh();
      window.location.reload();
    } catch (e) {
      const err = e as ApiErrorResponse;
      setSignInError(t(err.error));
    } finally {
      setIsSigningIn(false);
    }
  };

  return {
    isSigningIn,
    signInError,
    isSignInSuccess,
    signIn,
  };
}
