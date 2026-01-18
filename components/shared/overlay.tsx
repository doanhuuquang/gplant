"use client";

import { cn } from "@/lib/utils";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex?: number;
}

export function Overlay({ isOpen, onClose, zIndex = 30 }: OverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/70 transition-opacity duration-300 pointer-events-none",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0",
      )}
      style={{ zIndex }}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
