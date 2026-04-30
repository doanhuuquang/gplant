import AuthOptions from "@/components/feature/auth/auth-options";
import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { LoginForm } from "@/components/feature/auth/login-form";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="w-full relative flex-1">
      {/* Background */}
      <div className="md:block hidden w-full h-full absolute -z-1 md:bg-[url(/images/background-images/sign-in-background.svg)] bg-cover bg-center">
        <div className="w-full h-full bg-black/30"></div>
      </div>

      <div className="w-full max-w-7xl h-full mx-auto md:p-10 flex lg:flex-row flex-col md:justify-center justify-center items-center gap-10">
        <div className="w-full max-w-lg bg-container md:px-10 py-10 px-4 space-y-8 md:rounded-sm bg-background md:border border-foreground">
          <p className="text-center text-3xl font-bold">Đăng nhập</p>

          <AuthOptions />

          <LoginForm />

          {/* Dont have account */}
          <div className="text-center space-x-1">
            <span className="text-muted-foreground">Bạn mới đến đây?</span>
            <Link href={APP_PATHS.SIGN_UP}>
              <span className="underline">Tạo tài khoản Gplant</span>
            </Link>
          </div>

          <Separator />

          {/* Terms */}
          <div className="text-sm space-x-1">
            <span>Bằng việc tiếp tục, bạn đồng ý với</span>
            <span className="underline">
              <Link href={""}>Chính sách quyền riêng tư</Link>
            </span>
            <span>và</span>
            <span className="underline">
              <Link href={""}>Điều khoản dịch vụ</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
