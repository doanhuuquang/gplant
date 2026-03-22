import AppLogo from "@/components/shared/app-logo";
import { APP_PATHS } from "@/lib/constants/app-paths";
import Link from "next/link";

export default function CheckoutHeader() {
  return (
    <header className="w-full bg-[#1a1a1a] sticky top-0 z-50">
      <div className="w-full max-w-350 mx-auto p-4 flex items-center justify-between">
        <AppLogo forcedTheme="dark" variant="GPLANT_ICON_TEXT_DARK" />
        <Link
          href={APP_PATHS.SIGN_IN}
          className="text-white/70 hover:text-white transition-all text-sm"
        >
          Need help? Call 0123456789
        </Link>
      </div>
    </header>
  );
}
