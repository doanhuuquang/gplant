import { SignInForm } from "@/components/shared/auth/sign-in-form";
import AuthOptions from "@/components/shared/auth/auth-options";
import { Separator } from "@/components/ui/separator";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Page() {
  const t = useTranslations("Pages.Auth.SignIn");

  return (
    <div className="w-full relative flex-1">
      {/* Background */}
      <div className="md:block hidden w-full h-full absolute -z-1 md:bg-[url(/images/background-images/sign-in-background.svg)] bg-cover bg-center">
        <div className="w-full h-full bg-black/30"></div>
      </div>

      <div className="w-full max-w-7xl h-full mx-auto md:p-10 flex lg:flex-row flex-col md:justify-center justify-center items-center gap-10">
        <div className="w-full max-w-lg bg-container md:px-10 py-10 px-4 space-y-8 md:rounded-sm bg-background md:border border-foreground">
          <p className="text-center text-3xl font-bold">{t("SignIn")}</p>

          <AuthOptions />

          <SignInForm />

          {/* Dont have account */}
          <div className="text-center space-x-1">
            <span className="text-muted-foreground">{t("NewHere")}</span>
            <Link href={APP_PATHS.SIGN_UP}>
              <span className="underline">{t("CreateAGplantAccount")}</span>
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
