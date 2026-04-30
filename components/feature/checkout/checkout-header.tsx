import AppLogo from "@/components/common/app-logo";
import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";

export default function CheckoutHeader() {
  return (
    <header className="w-full bg-[#1a1a1a] sticky top-0 z-50 border-b">
      <div className="w-full max-w-350 mx-auto p-4 flex items-center justify-between">
        <AppLogo forcedTheme="dark" variant="GPLANT_ICON_TEXT_DARK" />
        <Link
          href={APP_PATHS.SIGN_IN}
          className="text-white/70 hover:text-white transition-all text-sm"
        >
          Hỗ trợ 0336314376
        </Link>
      </div>
    </header>
  );
}
