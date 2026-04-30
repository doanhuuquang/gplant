"use client";

import { APP_PATHS } from "@/lib/constants/app-paths";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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
  const pathName = usePathname();

  const [isShowAppHeader, setIsShowAppHeader] = useState<boolean>(true);

  useEffect(() => {
    const setHeaderVisibility = () => {
      if (
        pathName.includes(APP_PATHS.SHOP_SHIPPING) ||
        pathName.includes(APP_PATHS.SHOP_ORDER_CONFIRMATION) ||
        pathName.includes(APP_PATHS.SHOP_REVIEW)
      )
        setIsShowAppHeader(false);
      else setIsShowAppHeader(true);
    };

    setHeaderVisibility();
  }, [pathName]);

  return (
    <AppHeaderContext.Provider value={{ isShowAppHeader, setIsShowAppHeader }}>
      {children}
    </AppHeaderContext.Provider>
  );
}
