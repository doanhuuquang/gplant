"use client";

import * as React from "react";
import AppLogo from "@/components/shared/app-logo";
import { NavManagements } from "@/components/nav-managements";
import { NavUser } from "@/components/nav-user";

import {
  ChartPie,
  ClipboardList,
  Folder,
  Image,
  Layers2,
  Leaf,
  Package,
  Users,
  Zap,
} from "lucide-react";
import { Role } from "@/lib/enums/role";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth/use-auth";
import { APP_PATHS } from "@/lib/constants/app-paths";
import { NavLogo } from "@/components/nav-logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const data = {
    user: {
      name: `${user?.lastName} ${user?.firstName}`,
      email: `${user?.email}`,
      avatar: `${user?.profilePictureUrl}`,
    },
    navMain: [
      {
        title: "Gplant Shop",
        url: APP_PATHS.HOME,
        icon: Users,
        isActive: true,
      },
    ],
    managements: [
      {
        title: "Dashboard",
        url: APP_PATHS.DASHBOARD,
        icon: ChartPie,
        isActive: true,
      },
      {
        title: "Media Library",
        url: APP_PATHS.MEDIA_LIBRARY,
        icon: Folder,
        isActive: true,
      },
      {
        title: "Users Management",
        url: APP_PATHS.USERS_MANAGEMENT,
        icon: Users,
        isActive: true,
        allowedRoles: [Role.Admin],
      },
      {
        title: "Categories Management",
        url: APP_PATHS.CATEGORIES_MANAGEMENT,
        icon: Layers2,
        isActive: true,
      },
      {
        title: "Care Instructions",
        url: APP_PATHS.CARE_INSTRUCTIONS_MANAGEMENT,
        icon: ClipboardList,
        isActive: true,
      },
      {
        title: "Plants Management",
        url: APP_PATHS.PLANTS_MANAGEMENT,
        icon: Leaf,
        isActive: true,
      },
      {
        title: "Banners Management",
        url: APP_PATHS.BANNERS_MANAGEMENT,
        icon: Image,
        isActive: true,
      },
      {
        title: "Inventory Management",
        url: APP_PATHS.INVENTORY_MANAGEMENT,
        icon: Package,
        isActive: true,
      },
      {
        title: "Lightning Sales",
        url: APP_PATHS.LIGHTNING_SALES_MANAGEMENT,
        icon: Zap,
        isActive: true,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavManagements
          managements={data.managements}
          userRoles={user?.roles}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
