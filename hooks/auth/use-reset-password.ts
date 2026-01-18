import { APP_PATHS } from "@/lib/constants/app-paths";
import { type ApiErrorResponse } from "@/lib/schemas/api/api-error-response";
import { type ResetPasswordRequest } from "@/lib/schemas/auth/reset-password-request";
import { type SendOTPToEmailRequest } from "@/lib/schemas/auth/send-otp-to-email-request";
import { type VerifyOTPRequest } from "@/lib/schemas/auth/verify-otp-request";
import { resetPassword } from "@/services/account-services";
import { sendOTP, verifyOTP } from "@/services/otp-services";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

enum RESET_PASSWORD_STEP {
  EMAIL = "email",
  OTP = "otp",
  PASSWORD = "password",
}

interface LoadingState {
  otp: boolean;
  checking: boolean;
  resetting: boolean;
}

export default function useResetPassword() {
  const router = useRouter();
  const t = useTranslations("Pages.Auth.ResetPassword.Form");
  const te = useTranslations("Errors");

  const [step, setStep] = useState<RESET_PASSWORD_STEP>(
    RESET_PASSWORD_STEP.EMAIL
  );
  const [email, setEmail] = useState<string>("");
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(
    null
  );
  const [resetPasswordToken, setResetPasswordToken] = useState<string | null>(
    null
  );
  const [cooldown, setCooldown] = useState<number>(0);
  const [loading, setLoading] = useState<LoadingState>({
    otp: false,
    checking: false,
    resetting: false,
  });

  const send = async (data: SendOTPToEmailRequest) => {
    try {
      setLoading((prev) => ({ ...prev, otp: true }));
      setResetPasswordError(null);

      await sendOTP(data);

      setStep(RESET_PASSWORD_STEP.OTP);
      setCooldown(60);
    } catch (e) {
      const err = e as ApiErrorResponse;
      setResetPasswordError(te(err.error));
    } finally {
      setLoading((prev) => ({ ...prev, otp: false }));
    }
  };

  const reSend = async () => {
    try {
      if (!email) return;

      setLoading((prev) => ({ ...prev, otp: true }));
      setResetPasswordError(null);

      const data: SendOTPToEmailRequest = { email };
      await sendOTP(data);

      setCooldown(60);
    } catch (e) {
      const err = e as ApiErrorResponse;
      setResetPasswordError(te(err.error));
      setCooldown(0);
    } finally {
      setLoading((prev) => ({ ...prev, otp: false }));
    }
  };

  const verify = async (code: string) => {
    try {
      if (!email) return;

      setLoading((prev) => ({ ...prev, checking: true }));
      setResetPasswordError(null);

      const data: VerifyOTPRequest = { email, code };
      const response = await verifyOTP(data);
      setResetPasswordToken(response.data?.resetToken || null);

      setStep(RESET_PASSWORD_STEP.PASSWORD);
    } catch (e) {
      const err = e as ApiErrorResponse;
      setResetPasswordError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, checking: false }));
    }
  };

  const reset = async (newPassword: string) => {
    try {
      if (!email || !resetPasswordToken) return;

      setLoading((prev) => ({ ...prev, resetting: true }));
      setResetPasswordError(null);

      const data: ResetPasswordRequest = {
        email,
        resetPasswordToken,
        newPassword,
      };

      await resetPassword(data);

      toast.success(t("Success"), {
        description: t("PasswordResetSuccessful"),
        position: "top-center",
      });

      router.push(APP_PATHS.SIGN_IN);
    } catch (e) {
      const err = e as ApiErrorResponse;
      setResetPasswordError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, resetting: false }));
    }
  };

  const reEnterEmail = () => {
    setStep(RESET_PASSWORD_STEP.EMAIL);
    setEmail("");
    setResetPasswordError(null);
  };

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return {
    step,
    email,
    setEmail,
    resetPasswordError,
    cooldown,
    loading,
    send,
    reSend,
    verify,
    reset,
    reEnterEmail,
    RESET_PASSWORD_STEP,
  };
}
