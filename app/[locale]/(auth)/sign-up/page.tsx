import Link from "next/link";
import SignupOptions from "@/components/feature/auth/signup-options";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Separator } from "@/components/ui/separator";

library.add(faEnvelope);

export default function Page() {
  return (
    <div className="w-full relative flex-1">
      {/* Background */}
      <div className="md:block hidden w-full h-full absolute -z-1 md:bg-[url(/images/background-images/sign-up-background.svg)] bg-cover bg-bottom">
        <div className="w-full h-full bg-black/30"></div>
      </div>

      <div className="w-full max-w-7xl h-full mx-auto md:p-10 flex lg:flex-row flex-col md:justify-center justify-center items-center gap-10">
        <div className="w-full max-w-lg bg-container md:px-10 py-10 px-4 space-y-8 md:rounded-sm bg-background md:border border-foreground">
          <p className="text-center text-3xl font-bold">
            Tạo tài khoản miễn phí
          </p>

          <SignupOptions />

          {/* Already have account */}
          <div className="text-center space-x-1">
            <span className="text-muted-foreground">
              Bạn đã có tài khoản Gplant?
            </span>
            <Link href={APP_PATHS.SIGN_IN}>
              <span className="underline">Đăng nhập tại đây</span>
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
