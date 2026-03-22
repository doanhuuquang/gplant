"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AppHeaderContextProps {
  isShowAppHeader: boolean;
  setIsShowAppHeader: (isShow: boolean) => void;
}

const AppHeaderContext = createContext<AppHeaderContextProps | null>(null);

export function useAppHeaderContext() {
  const context = useContext(AppHeaderContext);
  if (!context) {
    throw new Error(
      "useAppHeaderContext must be used within AppHeaderProvider",
    );
  }
  return context;
}

export function AppHeaderProvider({ children }: { children: ReactNode }) {
  const [isShowAppHeader, setIsShowAppHeader] = useState<boolean>(true);

  return (
    <AppHeaderContext.Provider value={{ isShowAppHeader, setIsShowAppHeader }}>
      {children}
    </AppHeaderContext.Provider>
  );
}
