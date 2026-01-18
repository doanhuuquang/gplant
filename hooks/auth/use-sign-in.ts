import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { type SignInRequest } from "@/lib/schemas/auth/signin-request";
import { signInWithEmailAndPassword } from "@/services/account-services";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function useSignIn() {
  const t = useTranslations("Errors");

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
