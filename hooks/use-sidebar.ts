import { useState } from "react";

export function useSidebar() {
  const [open, setOpen] = useState<boolean>(true);
}
