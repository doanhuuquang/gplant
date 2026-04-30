import { useAdminHeaderContext } from "@/contexts/admin-header-context";
import { useEffect, type ReactNode } from "react";

export function useAdminHeader(actions: ReactNode) {
  const { setActions } = useAdminHeaderContext();

  useEffect(() => {
    setActions(actions);
    return () => setActions(null);
  }, [actions, setActions]);
}
