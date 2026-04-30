"use client";

import ReCAPTCHA from "react-google-recaptcha";
import useReCaptcha from "@/lib/hooks/use-recaptcha";
import z from "zod";
import { Button } from "@/components/ui/button";
import { CircleCheck, Info, LoaderCircle } from "lucide-react";
import { RecoverUsernameRequest } from "@/types/auth";
import { useForm } from "react-hook-form";
import { useRecoverUsername } from "@/lib/hooks/use-auth";
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

export default function RecoverUsernamesForm() {
  const { setToken, isVerified, setIsVerified } = useReCaptcha();
  const {
    mutate: recoverUsername,
    isPending,
    isSuccess,
    error,
  } = useRecoverUsername();

  const formSchema = z.object({
    email: z.email("Email không hợp lệ").min(1, {
      message: "Email là bắt buộc",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const request: RecoverUsernameRequest = { email: values.email };
    recoverUsername(request);
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

        <p className="text-destructive text-sm">{error?.message}</p>

        {isSuccess && (
          <div className="flex gap-2">
            <span>
              <CircleCheck className="fill-primary text-background" />
            </span>
            <span>Đã gửi thông tin tên đăng nhập tới email của bạn</span>
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
          disabled={isPending || !isVerified}
          className="md:w-fit w-full"
        >
          {/* {cooldown > 0 && <p>({cooldown})</p>} */}
          {isPending && <LoaderCircle className="animate-spin" />}
          Gửi tên đăng nhập
        </Button>
      </form>
    </Form>
  );
}
