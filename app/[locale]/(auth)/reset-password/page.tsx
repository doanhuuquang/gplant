import ResetPasswordForm from "@/components/shared/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="w-full max-w-3xl mx-auto md:p-10 p-4 space-y-5">
      <Link href={APP_PATHS.SIGN_IN}>
        <Button size={"icon"} variant={"outline"} className="rounded-full p-6">
          <ChevronLeft className="size-6" />
        </Button>
      </Link>

      <ResetPasswordForm />
    </main>
  );
}
