"use client";

import * as React from "react";
import AppFooter from "@/components/common/app-footer";
import AuthHeader from "@/components/feature/auth/auth-header";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full min-w-sm min-h-screen flex flex-col">
      <div className="w-full sticky top-0 z-100">
        <AuthHeader />
      </div>
      <div className={"w-full flex flex-col flex-1"}>{children}</div>
      <AppFooter />
    </div>
  );
}
