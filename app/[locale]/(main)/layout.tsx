import AppFooter from "@/components/shared/app-footer";
import AppHeader from "@/components/shared/app-header";
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
