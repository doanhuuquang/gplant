"use client";

import z from "zod";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { Info, LoaderCircle } from "lucide-react";
import { ResetPasswordRequestValidation } from "@/validations/auth";
import { useForm } from "react-hook-form";
import { useResetPassword } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
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

export default function ResetPasswordNewForm({ email }: { email: string }) {
  const router = useRouter();

  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const form = useForm<z.infer<typeof ResetPasswordRequestValidation>>({
    resolver: zodResolver(ResetPasswordRequestValidation),
    defaultValues: {
      email: email,
      newPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof ResetPasswordRequestValidation>) {
    resetPassword(values, {
      onSuccess: () => router.push(APP_PATHS.SIGN_IN),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
        <FormField
          control={form.control}
          name="newPassword"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel className="data-[error=true]:text-foreground">
                  Mật khẩu mới
                </FormLabel>
              </div>
              <FormControl>
                <InputGroup>
                  <InputGroupInput {...field} />
                  {form.formState.isSubmitted &&
                    form.formState.errors.newPassword && (
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

        <Button
          type="submit"
          disabled={isPending || !form.formState.isValid}
          className="md:w-fit w-full"
        >
          {isPending && <LoaderCircle className="animate-spin" />}
          Đặt lại mật khẩu
        </Button>
      </form>
    </Form>
  );
}
