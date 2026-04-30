"use client";

import AuthOptions from "@/components/feature/auth/auth-options";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignUpForm } from "@/components/feature/auth/signup-form";
import { useEffect, useRef, useState } from "react";

export default function SignupOptions() {
  const autoHeightDivRef = useRef<HTMLDivElement>(null);
  const signUpOptionsRef = useRef<HTMLDivElement>(null);
  const signUpFormRef = useRef<HTMLDivElement>(null);

  const [isSelectedSignUpWithEmail, setIsSelectedSignUpWithEmail] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      !autoHeightDivRef.current &&
      !signUpOptionsRef.current &&
      !signUpFormRef.current
    )
      return;

    const upDateHeight = () => {
      if (isSelectedSignUpWithEmail) {
        autoHeightDivRef.current!.style.minHeight =
          signUpFormRef.current!.offsetHeight + "px";
      } else {
        autoHeightDivRef.current!.style.minHeight =
          signUpOptionsRef.current!.offsetHeight + "px";
      }
    };

    upDateHeight();
  }, [isSelectedSignUpWithEmail]);

  return (
    <div
      ref={autoHeightDivRef}
      className="w-full relative overflow-hidden transition-[height] duration-300 ease-in-out"
    >
      {/* Sign Up options */}
      <div
        ref={signUpOptionsRef}
        className={cn(
          "w-full space-y-4 transition-all duration-300 ease-in-out",
          isSelectedSignUpWithEmail
            ? "opacity-0 -translate-x-full absolute top-0 pointer-events-none"
            : "opacity-100 translate-x-0",
        )}
      >
        <AuthOptions />

        <Button
          variant={"outline"}
          onClick={() => setIsSelectedSignUpWithEmail(true)}
          className="w-full border-foreground hover:bg-foreground dark:hover:bg-foreground hover:text-background"
        >
          <Mail className="size-6" />
          Tiếp tục với email
        </Button>
      </div>

      {/* Sign up form */}
      <div
        ref={signUpFormRef}
        className={cn(
          "w-full space-y-5 transition-all duration-300 ease-in-out",
          !isSelectedSignUpWithEmail
            ? "opacity-0 translate-x-full absolute top-0 pointer-events-none"
            : "opacity-100 translate-x-0",
        )}
      >
        <Button
          onClick={() => setIsSelectedSignUpWithEmail(false)}
          size={"icon"}
          variant={"outline"}
          className="rounded-full p-6"
        >
          <ChevronLeft className="size-6" />
        </Button>

        <SignUpForm />
      </div>
    </div>
  );
}
