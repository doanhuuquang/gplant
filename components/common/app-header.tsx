"use client";

import * as React from "react";
import AppLogo from "@/components/common/app-logo";
import Link from "next/link";
import SearchBar from "@/components/common/search-bar";
import { AccountDropdown } from "@/components/common/account-dropdown";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { Button } from "@/components/ui/button";
import { ChatBot } from "@/components/feature/chat/chat-bot";
import { cn } from "@/lib/utils";
import { MenuMobile } from "@/components/common/menu-mobile";
import { Navbar } from "@/components/common/navbar";
import { Overlay } from "@/components/common/overlay";
import { ShoppingBag } from "lucide-react";
import { useAppHeaderContext } from "@/contexts/app-header-context";

function CartButton({ className }: { className?: string }) {
  return (
    <Link href={APP_PATHS.SHOP_CART}>
      <Button
        variant={"outline"}
        className={cn("aspect-square rounded-full relative", className)}
      >
        <ShoppingBag className="size-5" />
      </Button>
    </Link>
  );
}

export default function AppHeader() {
  const { isShowAppHeader } = useAppHeaderContext();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  if (!isShowAppHeader) return null;

  return (
    <>
      <Overlay
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      />

      <header
        className={cn(
          "w-full h-fit bg-background/90 backdrop-blur-xs sticky top-0 z-50 transition-all duration-300",
          isDropdownOpen && "bg-background transition-all duration-300",
        )}
      >
        <div className="w-full max-w-350 mx-auto p-4 flex items-center justify-between gap-5">
          <AppLogo className="shrink-0" />

          <SearchBar
            className={cn(
              "md:flex hidden w-full max-w-7xl transition-all duration-300",
            )}
          />

          <div className="flex items-center gap-3">
            <ChatBot />

            <CartButton
              className={cn(
                "bg-background transition-all duration-300",
                isDropdownOpen && "bg-transparent transition-all duration-300",
              )}
            />

            <AccountDropdown />

            <MenuMobile className="md:hidden block" />
          </div>
        </div>

        <div className="w-full max-w-350 mx-auto md:block hidden mt-2">
          <Navbar onDropdownOpen={setIsDropdownOpen} />
        </div>
      </header>
    </>
  );
}
