"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminHeaderContextProps {
  actions: ReactNode | null;
  setActions: (actions: ReactNode | null) => void;
}

const AdminHeaderContext = createContext<AdminHeaderContextProps | null>(null);

export function useAdminHeaderContext() {
  const context = useContext(AdminHeaderContext);
  if (!context) {
    throw new Error(
      "useAdminHeaderContext must be used within AdminHeaderProvider",
    );
  }
  return context;
}

export function AdminHeaderProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ReactNode | null>(null);

  return (
    <AdminHeaderContext.Provider value={{ actions, setActions }}>
      {children}
    </AdminHeaderContext.Provider>
  );
}
