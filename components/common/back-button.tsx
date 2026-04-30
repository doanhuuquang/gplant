"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      size={"icon"}
      variant={"outline"}
      className="rounded-full p-6"
      onClick={() => router.back()}
    >
      <ChevronLeft className="size-6" />
    </Button>
  );
}
