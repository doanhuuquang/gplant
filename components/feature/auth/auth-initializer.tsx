"use client";

import { useMe } from "@/lib/hooks/use-user";

export function AuthInitializer() {
  useMe();
  return null;
}
