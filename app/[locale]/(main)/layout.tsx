import AppFooter from "@/components/common/app-footer";
import AppHeader from "@/components/common/app-header";
import { AppHeaderProvider } from "@/contexts/app-header-context";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-w-sm min-h-screen">
      <AppHeaderProvider>
        <AppHeader />
        {children}
        <AppFooter />
      </AppHeaderProvider>
    </div>
  );
}
