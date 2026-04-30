"use client";

import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSendOtp, useVerifyOtp } from "@/lib/hooks/use-otp";
import { VerifyOtpRequest } from "@/types/otp";
import { VerifyOtpRequestValidation } from "@/validations/otp";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function ResetPasswordVerifyOtpForm({
  email,
}: {
  email: string;
}) {
  const router = useRouter();

  const {
    mutate: verifyOtp,
    isPending: isVerifying,
    error: verifyError,
  } = useVerifyOtp();
  const {
    mutate: sendOtp,
    isPending: isSendding,
    error: sendError,
  } = useSendOtp();

  const COOLDOWN = 60;
  const STORAGE_KEY = "resetPasswordOtpCooldown";
  const [cooldown, setCooldown] = useState(0);

  const form = useForm<VerifyOtpRequest>({
    resolver: zodResolver(VerifyOtpRequestValidation),
    defaultValues: {
      email: email,
      code: "",
    },
  });

  useEffect(() => {
    setTimeout(() => {
      const lastSent = localStorage.getItem(STORAGE_KEY);
      if (lastSent) {
        const diff = Math.floor((Date.now() - Number(lastSent)) / 1000);
        if (diff < COOLDOWN) {
          setCooldown(COOLDOWN - diff);
        }
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  function resend() {
    if (cooldown > 0) return;
    sendOtp(
      { email },
      {
        onSuccess: () => {
          localStorage.setItem(STORAGE_KEY, Date.now().toString());
          setCooldown(COOLDOWN);
        },
      },
    );
  }

  function onSubmit(values: VerifyOtpRequest) {
    verifyOtp(values, {
      onSuccess: () =>
        router.push(`${APP_PATHS.RESET_PASSWORD_NEW}?email=${values.email}`),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <FormField
          control={form.control}
          name="code"
          disabled={isVerifying}
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel className="data-[error=true]:text-foreground">
                  OTP
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

        <p className="text-destructive text-sm">{verifyError?.message}</p>
        <p className="text-destructive text-sm">{sendError?.message}</p>

        <div className="space-y-3">
          <p>Mã OTP đã được gửi đến {email}</p>

          <div className="space-x-2">
            <span className="text-muted-foreground">Không nhận được mã?</span>
            <Button
              disabled={isSendding || isVerifying || cooldown > 0}
              type="button"
              variant={"ghost"}
              className="underline hover:cursor-pointer p-0 h-fit hover:bg-transparent"
              onClick={() => resend()}
            >
              <p>Gửi lại {cooldown > 0 && `(${cooldown}s)`}</p>
              {isSendding && (
                <LoaderCircle className="animate-spin inline-block size-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center flex-wrap-reverse">
          <Button variant={"outline"} className="md:w-fit w-full">
            Quay lại
          </Button>

          <Button
            type="submit"
            disabled={isVerifying}
            className="md:w-fit w-full"
          >
            {isVerifying && <LoaderCircle className="animate-spin" />}
            Xác minh
          </Button>
        </div>
      </form>
    </Form>
  );
}
