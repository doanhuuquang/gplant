"use client";

import ReCAPTCHA from "react-google-recaptcha";
import useReCaptcha from "@/lib/hooks/use-recaptcha";
import z from "zod";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { Info, LoaderCircle } from "lucide-react";
import { SendOtpRequestValidation } from "@/validations/otp";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSendOtp } from "@/lib/hooks/use-otp";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function ResetPasswordVerifyEmailForm() {
  const router = useRouter();
  const { setToken, isVerified, setIsVerified } = useReCaptcha();
  const { mutate: sendOtp, isPending, error } = useSendOtp();

  const form = useForm<z.infer<typeof SendOtpRequestValidation>>({
    resolver: zodResolver(SendOtpRequestValidation),
    defaultValues: {
      email: "",
    },
  });

  const STORAGE_KEY = "resetPasswordOtpCooldown";

  function onSubmit(values: z.infer<typeof SendOtpRequestValidation>) {
    sendOtp(values, {
      onSuccess: () => {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
        router.push(
          `${APP_PATHS.RESET_PASSWORD_VERIFY_OTP}?email=${values.email}`,
        );
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <FormField
          control={form.control}
          name="email"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel className="data-[error=true]:text-foreground">
                  Email
                </FormLabel>
              </div>
              <FormControl>
                <InputGroup>
                  <InputGroupInput {...field} placeholder="Email" />
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

        <p className="text-destructive text-sm">{error?.message}</p>

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
          disabled={isPending || !isVerified}
          className="md:w-fit w-full"
        >
          {isPending && <LoaderCircle className="animate-spin" />}
          Gửi mã OTP
        </Button>
      </form>
    </Form>
  );
}
