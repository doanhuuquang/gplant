import LoaderFullScreen from "@/components/shared/loader-full-screen";
import localFont from "next/font/local";
import { config } from "@fortawesome/fontawesome-svg-core";
import { LoaderProvider } from "@/contexts/loader-context";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";

config.autoAddCss = false;

const nohemi = localFont({
  src: [
    {
      path: "../public/fonts/Nohemi/Nohemi-ExtraLight.ttf",
      weight: "200",
    },
    {
      path: "../public/fonts/Nohemi/Nohemi-Light.ttf",
      weight: "300",
    },
    {
      path: "../public/fonts/Nohemi/Nohemi-Regular.ttf",
      weight: "400",
    },
    {
      path: "../public/fonts/Nohemi/Nohemi-Medium.ttf",
      weight: "500",
    },
    {
      path: "../public/fonts/Nohemi/Nohemi-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "../public/fonts/Nohemi/Nohemi-Bold.ttf",
      weight: "700",
    },
    {
      path: "../public/fonts/Nohemi/Nohemi-ExtraBold.ttf",
      weight: "800",
    },
    {
      path: "../public/fonts/Nohemi/Nohemi-Black.ttf",
      weight: "900",
    },
  ],
  variable: "--font-nohemi",
});

export const metadata: Metadata = {
  title: "Mua cây cảnh & dụng cụ làm vườn online | GPlant",
  icons: {
    icon: [{ url: "/gplant-branding/gplant-icon.svg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${nohemi.variable} ${nohemi.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LoaderProvider>
            {children}
            <Toaster />
            <LoaderFullScreen />
          </LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
