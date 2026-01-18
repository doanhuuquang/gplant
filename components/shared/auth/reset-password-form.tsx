"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useReCaptcha from "@/hooks/auth/use-recaptcha";
import useResetPassword from "@/hooks/auth/use-reset-password";
import { type SendOTPToEmailRequest } from "@/lib/schemas/auth/send-otp-to-email-request";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Info, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import z from "zod";

interface EmailInputProps {
  email: string;
  isSendingOTP: boolean;
  resetPasswordError: string | null;
  send: (data: SendOTPToEmailRequest) => void;
  setEmail: (email: string) => void;
}

interface OTPInputProps {
  email: string;
  isSendingOTP: boolean;
  isCheckingOtp: boolean;
  resetPasswordError: string | null;
  cooldown: number;
  back: () => void;
  reSend: () => void;
  verify: (code: string) => void;
}

interface NewPasswordInputProps {
  reset: (newPassword: string) => void;
  isResettingPassword: boolean;
  resetPasswordError: string | null;
}

function EmailInput({
  email,
  isSendingOTP,
  resetPasswordError,
  send,
  setEmail,
}: EmailInputProps) {
  const t = useTranslations("Pages.Auth.ResetPassword.Form");
  const tv = useTranslations("Validations");

  const { setToken, isVerified, setIsVerified } = useReCaptcha();

  const formSchema = z.object({
    email: z.email(tv("EmailIsNotValid")).min(1, {
      message: tv("EmailIsRequired"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data: SendOTPToEmailRequest = { email: values.email };
    send(data);

    setEmail(values.email);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <FormField
          control={form.control}
          name="email"
          disabled={isSendingOTP}
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel className="data-[error=true]:text-foreground">
                  {t("Email")}
                </FormLabel>
              </div>
              <FormControl>
                <InputGroup>
                  <InputGroupInput {...field} />
                  {form.formState.isSubmitted &&
                    form.formState.errors.email && (
                      <InputGroupAddon align="inline-end">
                        <Info className="size-6 fill-destructive text-background" />
                      </InputGroupAddon>
                    )}
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {resetPasswordError && (
          <p className="text-destructive text-sm">{resetPasswordError}</p>
        )}

        {form.formState.isValid &&
          process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY && (
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY}
              onChange={(token: string | null) => {
                setToken(token);
              }}
              onExpired={() => {
                setToken(null);
                setIsVerified(false);
              }}
            />
          )}

        <Button
          type="submit"
          disabled={isSendingOTP || !isVerified}
          className="md:w-fit w-full"
        >
          {isSendingOTP && <LoaderCircle className="animate-spin" />}
          {t("SendOTP")}
        </Button>
      </form>
    </Form>
  );
}

function OtpInput({
  email,
  isSendingOTP,
  isCheckingOtp,
  resetPasswordError,
  cooldown,
  back,
  reSend,
  verify,
}: OTPInputProps) {
  const t = useTranslations("Pages.Auth.ResetPassword.Form");
  const tv = useTranslations("Validations");

  const formSchema = z.object({
    otp: z.string().min(6, {
      message: tv("OTPIsRequired"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    verify(values.otp);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <FormField
          control={form.control}
          name="otp"
          disabled={isCheckingOtp}
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel className="data-[error=true]:text-foreground">
                  {t("OTP")}
                </FormLabel>
              </div>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {resetPasswordError && (
          <p className="text-destructive text-sm">{resetPasswordError}</p>
        )}

        <div className="space-y-3">
          <p>
            {t("AnOTPHasBeenSent")} {email}
          </p>

          <div>
            <span className="text-muted-foreground">
              {t("DidntReceiveTheCode")}{" "}
            </span>
            <Button
              disabled={isSendingOTP || cooldown > 0}
              type="button"
              variant={"ghost"}
              className="underline hover:cursor-pointer p-0 h-fit hover:bg-transparent"
              onClick={reSend}
            >
              {t("reSend")} {cooldown > 0 && `(${cooldown}s)`}{" "}
              {isSendingOTP && (
                <LoaderCircle className="animate-spin inline-block size-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-wrap-reverse">
          <Button
            onClick={back}
            variant={"outline"}
            className="md:w-fit w-full"
          >
            {t("Back")}
          </Button>

          <Button
            type="submit"
            disabled={isCheckingOtp}
            className="md:w-fit w-full"
          >
            {isCheckingOtp && <LoaderCircle className="animate-spin" />}
            {t("verify")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function NewPasswordInput({
  reset,
  isResettingPassword,
  resetPasswordError,
}: NewPasswordInputProps) {
  const t = useTranslations("Pages.Auth.ResetPassword.Form");
  const tv = useTranslations("Validations");

  const formSchema = z.object({
    password: z
      .string()
      .min(8, {
        message: tv("PasswordMinLength"),
      })
      .regex(/[a-z]/, { message: tv("PasswordLowercase") })
      .regex(/[A-Z]/, { message: tv("PasswordUppercase") })
      .regex(/[0-9]/, { message: tv("PasswordDigit") })
      .regex(/[^a-zA-Z0-9]/, tv("PasswordSpecialChar")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    reset(values.password);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <FormField
          control={form.control}
          name="password"
          disabled={isResettingPassword}
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel className="data-[error=true]:text-foreground">
                  {t("NewPassword")}
                </FormLabel>
              </div>
              <FormControl>
                <InputGroup>
                  <InputGroupInput {...field} />
                  {form.formState.isSubmitted &&
                    form.formState.errors.password && (
                      <InputGroupAddon align="inline-end">
                        <Info className="size-6 fill-destructive text-background" />
                      </InputGroupAddon>
                    )}
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {resetPasswordError && (
          <p className="text-destructive text-sm">{resetPasswordError}</p>
        )}

        <Button
          type="submit"
          disabled={isResettingPassword}
          className="md:w-fit w-full"
        >
          {isResettingPassword && <LoaderCircle className="animate-spin" />}
          {t("ResetPassword")}
        </Button>
      </form>
    </Form>
  );
}

export default function ResetPasswordForm() {
  const t = useTranslations("Pages.Auth.ResetPassword");
  const {
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
  } = useResetPassword();

  const renderTitle = () => {
    switch (step) {
      case RESET_PASSWORD_STEP.EMAIL:
        return t("ForgotPassword");
      case RESET_PASSWORD_STEP.OTP:
        return t("VerifyYourEmail");
      case RESET_PASSWORD_STEP.PASSWORD:
        return t("CreateNewPassword");
      default:
        return "";
    }
  };

  const renderSubtitle = () => {
    switch (step) {
      case RESET_PASSWORD_STEP.EMAIL:
        return t("EnterYourDetails");
      case RESET_PASSWORD_STEP.OTP:
        return t("EnterVerificationCode");
      case RESET_PASSWORD_STEP.PASSWORD:
        return t("EnterNewPassword");
      default:
        return "";
    }
  };

  const renderComponent = () => {
    switch (step) {
      case RESET_PASSWORD_STEP.EMAIL:
        return (
          <EmailInput
            email={email}
            isSendingOTP={loading.otp}
            resetPasswordError={resetPasswordError}
            send={send}
            setEmail={setEmail}
          />
        );

      case RESET_PASSWORD_STEP.OTP:
        return (
          <OtpInput
            email={email}
            isSendingOTP={loading.otp}
            isCheckingOtp={loading.checking}
            resetPasswordError={resetPasswordError}
            cooldown={cooldown}
            back={reEnterEmail}
            reSend={reSend}
            verify={verify}
          />
        );

      case RESET_PASSWORD_STEP.PASSWORD:
        return (
          <NewPasswordInput
            reset={reset}
            isResettingPassword={loading.resetting}
            resetPasswordError={resetPasswordError}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-7">
      <div className="space-y-5">
        <p className="text-5xl font-bold mt-5">{renderTitle()}</p>
        <p>{renderSubtitle()}</p>
      </div>
      {renderComponent()}
    </div>
  );
}
