"use client";

import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import useReCaptcha from "@/lib/hooks/use-recaptcha";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { Info, LoaderCircle } from "lucide-react";
import { LoginRequestValidation } from "@/validations/auth";
import { useForm } from "react-hook-form";
import { useLogin } from "@/lib/hooks/use-auth";
import { z } from "zod";
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

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin();
  const { setToken, isVerified, setIsVerified } = useReCaptcha();

  const form = useForm<z.infer<typeof LoginRequestValidation>>({
    resolver: zodResolver(LoginRequestValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginRequestValidation>) {
    login({ email: values.email, password: values.password });
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
                  Tên đăng nhập hoặc email
                </FormLabel>
                <FormLabel className="data-[error=true]:text-foreground">
                  <Link
                    href={APP_PATHS.RECOVER_USERNAME}
                    className="hover:underline"
                  >
                    Nhắc tôi
                  </Link>
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

        <FormField
          control={form.control}
          name="password"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel className="data-[error=true]:text-foreground">
                  Mật khẩu
                </FormLabel>
                <FormLabel className="data-[error=true]:text-foreground">
                  <Link
                    href={APP_PATHS.RESET_PASSWORD}
                    className="hover:underline"
                  >
                    Quên mật khẩu
                  </Link>
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

        <p className="text-destructive text-sm">{error?.message}</p>

        {form.formState.isValid &&
          process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY && (
            <div className="flex justify-center">
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
            </div>
          )}

        <Button
          type="submit"
          disabled={isPending || !isVerified}
          className="w-full"
        >
          {isPending && <LoaderCircle className="animate-spin" />}
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}
