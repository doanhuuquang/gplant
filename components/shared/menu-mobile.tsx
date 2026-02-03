"use client";

import * as React from "react";
import AppLogo from "@/components/shared/app-logo";
import Category from "@/lib/models/category";
import Image from "next/image";
import SearchBar from "@/components/shared/search-bar";
import { AccountDropdown } from "@/components/shared/account-dropdown";
import { ArrowLeft, ExternalLink, Menu, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetActiveCategories } from "@/hooks/category/use-get-active-categories";
import {
  Sheet,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks: {
  label: string;
  href: string;
}[] = [
  { label: "Sale", href: "/a" },
  { label: "Plant-Talk", href: "/b" },
  { label: "Corporate Gifts", href: "/c" },
  { label: "Preserved", href: "/d" },
];

interface MenuMobileProps {
  className?: string;
}

interface SubCategoriesSheetProps {
  parentCategory: Category;
  subCategories: Category[];
  onSubCategorySelect: () => void;
}

function SubCategoriesSheet({
  parentCategory,
  subCategories,
  onSubCategorySelect,
}: SubCategoriesSheetProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubCategoryClick = () => {
    setIsOpen(false);
    onSubCategorySelect();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="text-lg py-4 flex items-center justify-between">
          {parentCategory.name}
          <MoveRight className="size-4 text-muted-foreground" />
        </div>
      </SheetTrigger>
      <SheetContent className="z-101">
        <SheetHeader className="gap-4">
          <div className="flex items-center gap-5">
            <SheetCloseButton icon={ArrowLeft} />
            <div>
              <SheetTitle>{parentCategory.name}</SheetTitle>
              <SheetDescription>{parentCategory.description}</SheetDescription>
            </div>
          </div>

          <div className="w-full relative aspect-square mt-2">
            <Image
              src={parentCategory.imageUrl}
              alt={parentCategory.name}
              fill
              unoptimized
              className="object-cover object-center -z-1 rounded-2xl shadow-xl shadow-muted dark:shadow-background"
            />

            <div className="w-full h-full bg-linear-to-b from-transparent from-50% to-black/70 p-6 flex flex-col justify-end rounded-2xl">
              <div className="mb-2 text-3xl text-white font-medium sm:mt-4 uppercase">
                {parentCategory.name}
              </div>
              <p className="text-white/70 text-sm leading-tight">
                {parentCategory.description}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min px-4 divide-y overflow-y-scroll">
          {subCategories.map((subCategory) => (
            <div
              key={subCategory.id}
              className="text-lg py-4 flex items-center justify-between cursor-pointer"
              onClick={handleSubCategoryClick}
            >
              {subCategory.name}
              <ExternalLink className="size-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function MenuMobile({ className }: MenuMobileProps) {
  const { activeCategories } = useGetActiveCategories();
  const [parentCategories, setParentCategories] = React.useState<Category[]>(
    [],
  );
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setParentCategories(activeCategories.filter((cat) => !cat.parentId));
  }, [activeCategories]);

  const getSubcategories = (parentId: string) => {
    return activeCategories.filter((cat) => cat.parentId === parentId);
  };

  return (
    <div className={className}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="aspect-square rounded-full">
            <Menu className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="z-101">
          <SheetHeader className="gap-4">
            <div className="w-full grid grid-cols-4 items-center">
              <SheetCloseButton />
              <SheetTitle className="col-span-2">
                <AppLogo />
              </SheetTitle>
              <AccountDropdown className="ml-auto" />
            </div>

            <SearchBar className="w-full max-w-7xl border-border" />
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min px-4 divide-y overflow-y-scroll">
            {parentCategories.map((category) => (
              <SubCategoriesSheet
                key={category.id}
                parentCategory={category}
                subCategories={getSubcategories(category.id)}
                onSubCategorySelect={() => setIsOpen(false)}
              />
            ))}

            {navLinks.map((navLinkItem) => (
              <div
                key={navLinkItem.href}
                className="text-lg py-4 flex items-center justify-between"
                onClick={() => setIsOpen(false)}
              >
                {navLinkItem.label}
                <ExternalLink className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
