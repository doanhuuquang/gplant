"use client";

import { cn } from "@/lib/utils";

interface OverlayProps {
  isOpen?: boolean;
  onClose?: () => void;
  zIndex?: number;
  children?: React.ReactNode;
  className?: string;
}

export function Overlay({
  isOpen,
  onClose,
  zIndex = 30,
  children,
  className,
}: OverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/70 transition-opacity duration-300 pointer-events-none",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0",
        className,
      )}
      style={{ zIndex }}
      onClick={onClose}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
