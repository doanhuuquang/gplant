import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { type RecoverUsernameRequest } from "@/lib/schemas/auth/recover-username-request";
import { recoverUsername } from "@/services/account-services";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function useRecoverUsername() {
  const t = useTranslations("Errors");

  const [isRecovering, setIsRecovering] = useState<boolean>(false);
  const [recorverUsernameError, setRecoverUsernameError] = useState<
    string | null
  >(null);
  const [isRecoverUsernameSent, setIsRecoverUsernameSent] =
    useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);

  const recover = async (data: RecoverUsernameRequest) => {
    try {
      setIsRecovering(true);
      setRecoverUsernameError(null);
      setIsRecoverUsernameSent(false);

      await recoverUsername(data);

      setIsRecoverUsernameSent(true);
      setCooldown(60);
    } catch (e) {
      const err = e as ApiErrorResponse;
      setRecoverUsernameError(t(err.error));
      setIsRecoverUsernameSent(false);
    } finally {
      setIsRecovering(false);
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return {
    isRecovering,
    recorverUsernameError,
    isRecoverUsernameSent,
    recover,
    cooldown,
  };
}
