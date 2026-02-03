"use client";

import * as React from "react";

import AuthFooter from "@/components/shared/app-footer";
import AuthHeader from "@/components/shared/auth/auth-header";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full min-w-sm min-h-screen flex flex-col">
      <div className="w-full sticky top-0 z-100">
        <AuthHeader />
      </div>
      <div className={"w-full flex flex-col flex-1"}>{children}</div>
      <AuthFooter />
    </div>
  );
}
