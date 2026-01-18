"use client";

import AuthOptions from "@/components/shared/auth/auth-options";
import { SignUpForm } from "@/components/shared/auth/sign-up-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { cn } from "@/lib/utils";
import { ChevronLeft, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

library.add(faEnvelope);

export default function Page() {
  const t = useTranslations("Pages.Auth.SignUp");

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
    <div className="w-full relative flex-1">
      {/* Background */}
      <div className="md:block hidden w-full h-full absolute -z-1 md:bg-[url(/images/background-images/sign-up-background.svg)] bg-cover bg-bottom">
        <div className="w-full h-full bg-black/30"></div>
      </div>

      <div className="w-full max-w-7xl h-full mx-auto md:p-10 flex lg:flex-row flex-col md:justify-center justify-center items-center gap-10">
        <div className="w-full max-w-lg bg-container md:px-10 py-10 px-4 space-y-8 md:rounded-sm bg-background md:border border-foreground">
          <p className="text-center text-3xl font-bold">
            {t("CreateAFreeAccount")}
          </p>

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
                  : "opacity-100 translate-x-0"
              )}
            >
              <AuthOptions />

              <Button
                variant={"outline"}
                onClick={() => setIsSelectedSignUpWithEmail(true)}
                className="w-full border-foreground hover:bg-foreground dark:hover:bg-foreground hover:text-background"
              >
                <Mail className="size-6" />
                {t("ContinueWithEmail")}
              </Button>
            </div>

            {/* Sign up form */}
            <div
              ref={signUpFormRef}
              className={cn(
                "w-full space-y-5 transition-all duration-300 ease-in-out",
                !isSelectedSignUpWithEmail
                  ? "opacity-0 translate-x-full absolute top-0 pointer-events-none"
                  : "opacity-100 translate-x-0"
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

          {/* Already have account */}
          <div className="text-center space-x-1">
            <span className="text-muted-foreground">
              {t("AlreadyHaveAnGplantAccount")}
            </span>
            <Link href={APP_PATHS.SIGN_IN}>
              <span className="underline">{t("SignInHere")}</span>
            </Link>
          </div>

          <Separator />

          {/* Terms */}
          <div className="text-sm space-x-1">
            <span>{t("ByContinuing")}</span>
            <span className="underline">
              <Link href={""}>{t("PrivacyPolicy")}</Link>
            </span>
            <span>{t("And")}</span>
            <span className="underline">
              <Link href={""}>{t("TermsOfService")}</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
