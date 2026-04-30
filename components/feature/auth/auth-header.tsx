import AppLogo from "@/components/common/app-logo";
import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";

export default function AuthHeader() {
  return (
    <header className="w-full bg-[#1a1a1a] sticky top-0">
      <div className="w-full max-w-500 mx-auto md:px-10 p-4 flex items-center justify-between">
        <AppLogo forcedTheme="dark" variant="GPLANT_ICON_TEXT_DARK" />
        <Link
          href={APP_PATHS.SIGN_IN}
          className="text-white/70 hover:text-white transition-all text-sm"
        >
          Đăng nhập
        </Link>
      </div>
    </header>
  );
}
