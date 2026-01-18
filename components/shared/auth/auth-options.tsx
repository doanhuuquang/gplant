"use client";

import { Button } from "@/components/ui/button";
import {
  continueWithFacebook,
  continueWithGoogle,
  continueWithMicrosoft,
} from "@/services/account-services";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AuthOptions() {
  const t = useTranslations("Pages.Auth.Options");

  return (
    <div className="w-full space-y-4">
      <Button
        onClick={continueWithGoogle}
        variant={"outline"}
        className="w-full border-foreground dark:hover:bg-foreground hover:bg-foreground hover:text-background"
      >
        <Image src={"/icons/google.svg"} alt="Google" width={24} height={24} />
        {t("ContinueWithGoogle")}
      </Button>

      <Button
        onClick={continueWithFacebook}
        variant={"outline"}
        className="w-full border-foreground hover:bg-foreground dark:hover:bg-foreground hover:text-background"
      >
        <Image
          src={"/icons/facebook.svg"}
          alt="Facebook"
          width={24}
          height={24}
        />
        {t("ContinueWithFacebook")}
      </Button>

      <Button
        onClick={continueWithMicrosoft}
        variant={"outline"}
        className="w-full border-foreground hover:bg-foreground dark:hover:bg-foreground hover:text-background group"
      >
        <Image
          src={"/icons/microsoft.svg"}
          alt="Microsoft"
          width={24}
          height={24}
        />
        {t("ContinueWithMicrosoft")}
      </Button>
    </div>
  );
}
