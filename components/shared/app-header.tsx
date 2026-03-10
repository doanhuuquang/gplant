"use client";

import * as React from "react";
import AppLogo from "@/components/shared/app-logo";
import SearchBar from "@/components/shared/search-bar";
import { AccountDropdown } from "@/components/shared/account-dropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuMobile } from "@/components/shared/menu-mobile";
import { Navbar } from "@/components/shared/navbar";
import { Overlay } from "@/components/shared/overlay";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { APP_PATHS } from "@/lib/constants/app-paths";

function CartButton() {
  return (
    <Link href={APP_PATHS.SHOP_CART}>
      <Button
        variant={"outline"}
        className="aspect-square rounded-full relative"
      >
        <ShoppingBag className="size-6" />
      </Button>
    </Link>
  );
}

export default function AppHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <>
      <Overlay
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      />

      <header
        className={cn(
          "w-full h-fit bg-background/95 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300",
          isDropdownOpen &&
            "border-b-border bg-background transition-all duration-300",
        )}
      >
        <div className="w-full max-w-350 mx-auto p-4 flex items-center justify-between gap-10">
          <AppLogo className="shrink-0" />

          <SearchBar className="md:flex hidden w-full max-w-7xl" />

          <div className="flex items-center gap-3">
            <CartButton />

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
