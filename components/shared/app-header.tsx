"use client";

import AppLogo from "@/components/shared/app-logo";
import SearchBar from "@/components/shared/search-bar";
import { AccountDropdown } from "@/components/shared/account-dropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuMobile } from "@/components/shared/menu-mobile";
import { Navbar } from "@/components/shared/navbar";
import { Overlay } from "@/components/shared/overlay";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function AppHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <Overlay
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
      />

      <header
        className={cn(
          "w-full h-fit bg-background/90 backdrop-blur-lg sticky top-0 z-50",
          isDropdownOpen && "border-b-border",
        )}
      >
        <div className="w-full max-w-350 mx-auto p-4 flex items-center justify-between gap-10">
          <AppLogo className="shrink-0" />

          <SearchBar className="md:flex hidden w-full max-w-7xl" />

          <div className="flex items-center gap-3">
            <Button variant={"outline"} className="aspect-square rounded-full">
              <ShoppingBag className="size-5" />
            </Button>

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
