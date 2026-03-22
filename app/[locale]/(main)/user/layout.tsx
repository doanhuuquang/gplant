"use client";

import { APP_PATHS } from "@/lib/constants/app-paths";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { MapPin, Package, Smile } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function UserSidebar() {
  const pathName = usePathname();
  const { user } = useAuthStore();

  const menu: {
    url: string;
    title: string;
    icon: React.ReactNode;
  }[] = [
    {
      url: APP_PATHS.USER_ACCOUNT,
      title: "Account",
      icon: <Smile className="shrink-0 size-5" />,
    },
    {
      url: APP_PATHS.USER_ADDRESSES,
      title: "Addresses",
      icon: <MapPin className="shrink-0 size-5" />,
    },
    {
      url: APP_PATHS.USER_ORDERS,
      title: "Orders",
      icon: <Package className="shrink-0 size-5" />,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="w-full text-lg font-medium border-b pb-2">
        Hello, {user?.lastName} {user?.firstName}
      </div>
      <div className="flex lg:flex-col flex-row gap-5 lg:items-start items-center justify-between">
        {menu.map((item, index) => (
          <Link
            key={index}
            href={item.url}
            className="w-fit flex items-center gap-2 group"
          >
            {item.icon}
            <p
              className={cn(
                "group-hover:underline underline-offset-4",
                pathName.includes(item.url) && "underline",
              )}
            >
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-[70vh]">
      <div className="w-full max-w-350 mx-auto px-4 py-10 grid grid-cols-4 gap-10">
        <div className="lg:col-span-1 col-span-4">
          <UserSidebar />
        </div>
        <div className="lg:col-span-3 col-span-4">{children}</div>
      </div>
    </div>
  );
}
