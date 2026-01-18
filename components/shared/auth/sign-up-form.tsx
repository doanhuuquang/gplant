"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { Info, LoaderCircle } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import useSignUP from "@/hooks/auth/use-sign-up";
import { useEffect } from "react";

export function SignUpForm() {
  const t = useTranslations("Pages.Auth.SignUp.Form");
  const tv = useTranslations("Validations");
  const { isSigningUp, signUpError, isSignUpSuccess, signUp } = useSignUP();

  const formSchema = z.object({
    firstName: z.string().min(1, {
      message: tv("FirstNameIsRequired"),
    }),
    lastName: z.string().min(1, {
      message: tv("LastNameIsRequired"),
    }),
    email: z.email(tv("InvalidEmailAddress")).min(1, {
      message: tv("EmailIsRequired"),
    }),
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isSignUpSuccess) {
      form.reset();
    }
  }, [isSignUpSuccess, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    signUp({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <div className="w-full flex items-start gap-5">
          <FormField
            control={form.control}
            name="firstName"
            disabled={isSigningUp}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="data-[error=true]:text-foreground">
                  {t("FirstName")}
                </FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput {...field} />
                    {form.formState.isSubmitted &&
                      form.formState.errors.firstName && (
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
            name="lastName"
            disabled={isSigningUp}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="data-[error=true]:text-foreground">
                  {t("LastName")}
                </FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput {...field} />
                    {form.formState.isSubmitted &&
                      form.formState.errors.lastName && (
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
        </div>

        <FormField
          control={form.control}
          name="email"
          disabled={isSigningUp}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="data-[error=true]:text-foreground ">
                {t("Email")}
              </FormLabel>
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
          disabled={isSigningUp}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="data-[error=true]:text-foreground ">
                {t("Password")}
              </FormLabel>
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
              <FormDescription>{t("PasswordValidGuide")}</FormDescription>
            </FormItem>
          )}
        />

        <p className="text-destructive text-sm">{signUpError}</p>

        <Button type="submit" disabled={isSigningUp} className="w-full">
          {isSigningUp && <LoaderCircle className="animate-spin" />}
          {t("CreateAccount")}
        </Button>
      </form>
    </Form>
  );
}
