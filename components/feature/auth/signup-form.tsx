"use client";

import { Button } from "@/components/ui/button";
import { Info, LoaderCircle } from "lucide-react";
import { SignupRequestValidation } from "@/validations/auth";
import { useForm } from "react-hook-form";
import { useSignup } from "@/lib/hooks/use-auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
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

export function SignUpForm() {
  const { mutate: signup, isPending, error } = useSignup();

  const form = useForm<z.infer<typeof SignupRequestValidation>>({
    resolver: zodResolver(SignupRequestValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof SignupRequestValidation>) {
    signup(values, {
      onSuccess: () => form.reset(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <div className="w-full flex items-start gap-5">
          <FormField
            control={form.control}
            name="firstName"
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="data-[error=true]:text-foreground">
                  Tên
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
            disabled={isPending}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="data-[error=true]:text-foreground">
                  Họ
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
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="data-[error=true]:text-foreground ">
                Email
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
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="data-[error=true]:text-foreground ">
                Mật khẩu
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
              <FormDescription>
                Mật khẩu phải đủ mạnh và an toàn.
              </FormDescription>
            </FormItem>
          )}
        />

        <p className="text-destructive text-sm">{error?.message}</p>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <LoaderCircle className="animate-spin" />}
          Tạo tài khoản
        </Button>
      </form>
    </Form>
  );
}
