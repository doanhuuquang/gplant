"use client";

import * as React from "react";
import { NavManagements } from "@/components/feature/admin/nav-managements";
import { NavUser } from "@/components/feature/admin/nav-user";

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
import { APP_PATHS } from "@/lib/constants/app-paths";
import { NavLogo } from "@/components/feature/admin/nav-logo";
import { useAuthStore } from "@/lib/stores/auth-store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const data = {
    user: {
      name: `${user?.lastName} ${user?.firstName}`,
      email: `${user?.email}`,
      avatar: `${user?.profilePictureUrl}`,
    },
    navMain: [
      {
        title: "Cửa hàng Gplant",
        url: APP_PATHS.HOME,
        icon: Users,
        isActive: true,
      },
    ],
    managements: [
      {
        title: "Tổng quan",
        url: APP_PATHS.DASHBOARD,
        icon: ChartPie,
        isActive: true,
      },
      {
        title: "Thư viện media",
        url: APP_PATHS.MEDIA_LIBRARY,
        icon: Folder,
        isActive: true,
      },
      {
        title: "Quản lý người dùng",
        url: APP_PATHS.USERS_MANAGEMENT,
        icon: Users,
        isActive: true,
        allowedRoles: [Role.Admin],
      },
      {
        title: "Quản lý danh mục",
        url: APP_PATHS.CATEGORIES_MANAGEMENT,
        icon: Layers2,
        isActive: true,
      },
      {
        title: "Hướng dẫn chăm sóc",
        url: APP_PATHS.CARE_INSTRUCTIONS_MANAGEMENT,
        icon: ClipboardList,
        isActive: true,
      },
      {
        title: "Quản lý cây",
        url: APP_PATHS.PLANTS_MANAGEMENT,
        icon: Leaf,
        isActive: true,
      },
      {
        title: "Quản lý banner",
        url: APP_PATHS.BANNERS_MANAGEMENT,
        icon: Image,
        isActive: true,
      },
      {
        title: "Quản lý tồn kho",
        url: APP_PATHS.INVENTORY_MANAGEMENT,
        icon: Package,
        isActive: true,
      },
      {
        title: "Quản lý khuyến mãi",
        url: APP_PATHS.LIGHTNING_SALES_MANAGEMENT,
        icon: Zap,
        isActive: true,
      },
      {
        title: "Quản lý đơn hàng",
        url: APP_PATHS.ORDERS_MANAGEMENT,
        icon: Package,
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
