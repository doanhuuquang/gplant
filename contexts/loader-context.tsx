"use client";

import { useLoader } from "@/hooks/use-loader";
import { createContext, useContext } from "react";

interface LoaderContextProps {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextProps | null>(null);

export function useLoaderContext() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoaderContext must be used within LoaderProvider");
  }
  return context;
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const loader = useLoader();

  return (
    <LoaderContext.Provider value={loader}>{children}</LoaderContext.Provider>
  );
}
