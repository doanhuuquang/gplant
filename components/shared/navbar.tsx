"use client";

import * as React from "react";
import Link from "next/link";
import { getFileUrl } from "@/utils/helpers";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { useGetActiveCategories } from "@/hooks/category/use-get-active-categories";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import CategoryResponse from "@/lib/schemas/category/category-response";

const navLinks: {
  label: string;
  href: string;
}[] = [
  { label: "Sale", href: "/a" },
  { label: "Plant-Talk", href: "/b" },
  { label: "Corporate Gifts", href: "/c" },
  { label: "Preserved", href: "/d" },
];

interface NavbarProps {
  onDropdownOpen: (isOpen: boolean) => void;
  className?: string;
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="flex flex-row items-center justify-between rounded-none! p-4"
        >
          <div className="space-y-1">
            <div>{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </div>
          <ExternalLink />
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export function Navbar({ onDropdownOpen, className }: NavbarProps) {
  const { activeCategories } = useGetActiveCategories();

  const navWrapperRef = React.useRef<HTMLDivElement>(null);

  const [navMenuContentWidth, setNavMenuContentWidth] =
    React.useState<number>(0);
  const [selectedNavItem, setSelectedNavItem] = React.useState<string>("");
  const [parentCategories, setParentCategories] = React.useState<
    CategoryResponse[]
  >([]);

  const handleMouseEnter = (itemId: string) => {
    setSelectedNavItem(itemId);
    onDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setSelectedNavItem("");
    onDropdownOpen(false);
  };

  const handleMouseClick = () => {
    setSelectedNavItem("");
    onDropdownOpen(false);
  };

  React.useEffect(() => {
    setParentCategories(activeCategories.filter((cat) => !cat.parentId));
  }, [activeCategories]);

  React.useEffect(() => {
    if (navWrapperRef.current) {
      setNavMenuContentWidth(navWrapperRef.current.offsetWidth);
    }
  }, [activeCategories]);

  React.useEffect(() => {
    const handleResize = () => {
      if (navWrapperRef.current) {
        setNavMenuContentWidth(navWrapperRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getSubcategories = (parentId: string) => {
    return activeCategories.filter((cat) => cat.parentId === parentId);
  };

  return (
    <div ref={navWrapperRef} className="w-full flex flex-wrap items-center">
      <NavigationMenu className={cn("w-full", className)}>
        <NavigationMenuList className="w-full flex gap-0">
          {parentCategories.map((category) => (
            <NavigationMenuItem key={category.id}>
              <Link href={`${APP_PATHS.SHOP}${category.slug}`}>
                <NavigationMenuTrigger
                  onClick={() => handleMouseClick()}
                  onMouseEnter={() => handleMouseEnter(category.id)}
                  onMouseLeave={handleMouseLeave}
                  className={cn(
                    "p-4 hover:cursor-pointer bg-transparent rounded-none border-b-3 border-b-transparent hover:border-b-primary text-sm transition-all font-normal",
                    selectedNavItem === category.id &&
                      "border-b-primary transition-all",
                  )}
                >
                  {category.name}
                </NavigationMenuTrigger>
              </Link>

              <NavigationMenuContent
                onMouseEnter={() => handleMouseEnter(category.id)}
                onMouseLeave={handleMouseLeave}
                style={{
                  width:
                    navMenuContentWidth > 0
                      ? `${navMenuContentWidth}px`
                      : "auto",
                }}
              >
                <ul className="grid gap-4 w-full h-fit lg:grid-cols-[.75fr_1fr] p-4">
                  <li>
                    <NavigationMenuLink asChild className="p-0 overflow-hidden">
                      <Link
                        className="h-full w-full rounded-sm no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md aspect-square"
                        style={{
                          backgroundImage: `url(${getFileUrl(category.media.fileUrl)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        href="/"
                      >
                        <div className="w-full h-full bg-linear-to-b from-transparent from-50% to-black/70 p-6 flex flex-col justify-end">
                          <div className="mb-2 text-3xl text-white font-medium sm:mt-4 uppercase">
                            {category.name}
                          </div>
                          <p className="text-white/70 text-sm leading-tight">
                            {category.description}
                          </p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </li>

                  <div className="divide-y">
                    {getSubcategories(category.id).map((subCategory) => (
                      <ListItem
                        key={subCategory.id}
                        href={`/categories/${subCategory.slug}`}
                        title={subCategory.name}
                      >
                        {subCategory.description}
                      </ListItem>
                    ))}
                  </div>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm px-4 py-1.5 hover:bg-muted transition-all duration-500 border-b-3 border-b-transparent hover:border-b-primary"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
