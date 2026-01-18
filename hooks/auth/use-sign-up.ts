import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { type SignUpRequest } from "@/lib/schemas/auth/signup-request";
import { signUpWithEmail } from "@/services/account-services";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function useSignUP() {
  const t = useTranslations("Errors");

  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [isSignUpSuccess, setIsSignUpSuccess] = useState<boolean>(false);

  const signUp = async (data: SignUpRequest) => {
    try {
      setIsSigningUp(true);
      setSignUpError(null);
      setIsSignUpSuccess(false);

      await signUpWithEmail(data);

      setIsSignUpSuccess(true);
    } catch (e) {
      const err = e as ApiErrorResponse;
      setSignUpError(t(err.error));
    } finally {
      setIsSigningUp(false);
    }
  };

  return { isSigningUp, signUpError, isSignUpSuccess, signUp };
}
