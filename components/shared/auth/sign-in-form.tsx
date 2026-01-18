"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Info, LoaderCircle } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import useLogin from "@/hooks/auth/use-sign-in";
import useReCaptcha from "@/hooks/auth/use-recaptcha";
import ReCAPTCHA from "react-google-recaptcha";
import { APP_PATHS } from "@/lib/constants/app-paths";

export function SignInForm() {
  const t = useTranslations("Pages.Auth.SignIn.Form");
  const tv = useTranslations("Validations");

  const { isSigningIn, signInError, signIn } = useLogin();
  const { setToken, isVerified, setIsVerified } = useReCaptcha();

  const formSchema = z.object({
    emailOrUsername: z.string().min(1, {
      message: tv("UsernameIsRequired"),
    }),
    password: z.string().min(1, {
      message: tv("PasswordIsRequired"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signIn({ email: values.emailOrUsername, password: values.password });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <FormField
          control={form.control}
          name="emailOrUsername"
          disabled={isSigningIn}
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel className="data-[error=true]:text-foreground">
                  {t("UsernameOrEmail")}
                </FormLabel>
                <FormLabel className="data-[error=true]:text-foreground">
                  <Link
                    href={APP_PATHS.RECOVER_USERNAME}
                    className="hover:underline"
                  >
                    {t("RemindMe")}
                  </Link>
                </FormLabel>
              </div>
              <FormControl>
                <InputGroup>
                  <InputGroupInput {...field} />
                  {form.formState.isSubmitted &&
                    form.formState.errors.emailOrUsername && (
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
          disabled={isSigningIn}
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel className="data-[error=true]:text-foreground">
                  {t("Password")}
                </FormLabel>
                <FormLabel className="data-[error=true]:text-foreground">
                  <Link
                    href={APP_PATHS.RESET_PASSWORD}
                    className="hover:underline"
                  >
                    {t("ForgotPassword")}
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

        <p className="text-destructive text-sm">{signInError}</p>

        <Button
          type="submit"
          disabled={isSigningIn || !isVerified}
          className="w-full"
        >
          {isSigningIn && <LoaderCircle className="animate-spin" />}
          {t("SignIn")}
        </Button>
      </form>
    </Form>
  );
}
