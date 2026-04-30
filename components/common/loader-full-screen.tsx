"use client";

import { Overlay } from "@/components/common/overlay";
import { useLoaderContext } from "@/contexts/loader-context";
import { LoaderCircle } from "lucide-react";

export default function LoaderFullScreen() {
  const { isLoading } = useLoaderContext();

  return (
    <Overlay
      zIndex={999}
      className="w-full h-full flex items-center justify-center"
      isOpen={isLoading}
    >
      <LoaderCircle className="size-10 animate-spin text-white" />
    </Overlay>
  );
}
