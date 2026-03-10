"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAdminHeaderContext } from "@/contexts/admin-header-context";

export default function AdminHeader() {
  const { actions } = useAdminHeaderContext();

  return (
    <header className="w-full flex px-4 h-19 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background border-b">
      <SidebarTrigger className="-ml-1" />
      {actions && (
        <div className="w-full flex items-center justify-end gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}
