import AdminHeader from "@/components/feature/admin/admin-header";
import { AdminHeaderProvider } from "@/contexts/admin-header-context";
import { AppSidebar } from "@/components/feature/admin/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminHeaderProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="w-full bg-muted/50 dark:bg-black/30">
            <AdminHeader />
            <div className="flex flex-1 flex-col gap-2 p-2">
              <div className="grid auto-rows-min gap-2">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AdminHeaderProvider>
    </div>
  );
}
