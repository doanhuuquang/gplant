import AppFooter from "@/components/shared/app-footer";
import AppHeader from "@/components/shared/app-header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-w-sm min-h-screen">
      <AppHeader />
      {children}
      <AppFooter />
    </div>
  );
}
