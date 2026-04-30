"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import { type LucideIcon } from "lucide-react";
import { type Role } from "@/lib/enums/role";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavManagements({
  managements,
  userRoles,
}: {
  managements: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    allowedRoles?: Role[];
  }[];
  userRoles?: Role[];
}) {
  const pathName = usePathname();

  const filteredManagements = managements.filter(
    (item) =>
      !item.allowedRoles ||
      item.allowedRoles.some((role) => userRoles?.includes(role)),
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main menu</SidebarGroupLabel>
      <SidebarMenu>
        {filteredManagements.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "transition-colors group-data-[state=open]:bg-primary",
                    pathName.includes(item.url) &&
                      "bg-primary text-primary-foreground",
                  )}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
