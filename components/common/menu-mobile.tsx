"use client";

import * as React from "react";
import AppLogo from "@/components/common/app-logo";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/common/search-bar";
import { AccountDropdown } from "@/components/common/account-dropdown";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { ArrowLeft, ExternalLink, Menu, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryResponse } from "@/types/category";
import { getFileUrl } from "@/utils/helpers";
import { useActiveCategories } from "@/lib/hooks/use-category";

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
  { label: "Khuyến mãi", href: "/a" },
  { label: "Plant-Talk", href: "/b" },
  { label: "Quà tặng doanh nghiệp", href: "/c" },
  { label: "Cây bảo tồn", href: "/d" },
];

interface MenuMobileProps {
  className?: string;
}

interface SubCategoriesSheetProps {
  parentCategory: CategoryResponse;
  subCategories: CategoryResponse[];
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

          <Link
            href={`${APP_PATHS.SHOP}${parentCategory.slug}`}
            onClick={() => handleSubCategoryClick()}
            className="w-full relative aspect-square mt-2"
          >
            <Image
              src={getFileUrl(parentCategory.media.fileUrl)}
              alt={parentCategory.name}
              fill
              unoptimized
              className="object-cover object-center -z-1 rounded-2xl shadow-xl shadow-muted dark:shadow-background"
            />

            <div className="w-full h-full bg-linear-to-b from-transparent from-50% to-black/70 p-6 flex flex-col justify-end rounded-2xl">
              <div className="w-full flex justify-between items-end gap-4">
                <div>
                  <div className="mb-2 text-3xl text-white font-medium sm:mt-4 uppercase">
                    {parentCategory.name}
                  </div>
                  <p className="text-white/70 text-sm leading-tight">
                    {parentCategory.description}
                  </p>
                </div>
                <ExternalLink className="text-white/50 shrink-0 size-5" />
              </div>
            </div>
          </Link>
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
  const [parentCategories, setParentCategories] = React.useState<
    CategoryResponse[]
  >([]);
  const [isOpen, setIsOpen] = React.useState(false);

  const { data } = useActiveCategories();

  React.useEffect(() => {
    setParentCategories(data?.data.filter((cat) => !cat.parentId) || []);
  }, [data]);

  const getSubcategories = (parentId: string): CategoryResponse[] => {
    return data?.data.filter((cat) => cat.parentId === parentId) || [];
  };

  return (
    <div className={className}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="aspect-square rounded-full bg-background"
          >
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
