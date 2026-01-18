"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Info, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import z from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import useReCaptcha from "@/hooks/auth/use-recaptcha";
import useRecoverUsername from "@/hooks/auth/use-recover-username";
import { type RecoverUsernameRequest } from "@/lib/schemas/auth/recover-username-request";

export default function RecoverUsernamesForm() {
  const t = useTranslations("Pages.Auth.RecoverUsername.Form");
  const tv = useTranslations("Validations");

  const { setToken, isVerified, setIsVerified } = useReCaptcha();
  const {
    isRecovering,
    recorverUsernameError,
    isRecoverUsernameSent,
    recover,
    cooldown,
  } = useRecoverUsername();

  const formSchema = z.object({
    email: z.email(tv("EmailIsNotValid")).min(1, {
      message: tv("EmailIsRequired"),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data: RecoverUsernameRequest = { email: values.email };
    recover(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <FormField
          control={form.control}
          name="email"
          disabled={isRecovering}
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

        <p className="text-destructive text-sm">{recorverUsernameError}</p>

        {isRecoverUsernameSent && (
          <div className="flex gap-2">
            <span>
              <CircleCheck className="fill-primary text-background" />
            </span>
            <span>{t("RecoverUsernameSent")}</span>
          </div>
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
          disabled={isRecovering || !isVerified || cooldown > 0}
          className="md:w-fit w-full"
        >
          {cooldown > 0 && <p>({cooldown})</p>}
          {isRecovering && <LoaderCircle className="animate-spin" />}
          {t("SendUsername")}
        </Button>
      </form>
    </Form>
  );
}
