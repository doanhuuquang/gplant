"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  useContinueWithFacebook,
  useContinueWithGoogle,
  useContinueWithMicrosoft,
} from "@/lib/hooks/use-auth";

export default function AuthOptions() {
  const { mutate: continueWithGoogle } = useContinueWithGoogle();
  const { mutate: continueWithFacebook } = useContinueWithFacebook();
  const { mutate: continueWithMicrosoft } = useContinueWithMicrosoft();

  return (
    <div className="w-full space-y-4">
      <Button
        onClick={() => continueWithGoogle()}
        variant={"outline"}
        className="w-full border-foreground dark:hover:bg-foreground hover:bg-foreground hover:text-background"
      >
        <Image src={"/icons/google.svg"} alt="Google" width={24} height={24} />
        Tiếp tục với Google
      </Button>

      <Button
        onClick={() => continueWithFacebook()}
        variant={"outline"}
        className="w-full border-foreground hover:bg-foreground dark:hover:bg-foreground hover:text-background"
      >
        <Image
          src={"/icons/facebook.svg"}
          alt="Facebook"
          width={24}
          height={24}
        />
        Tiếp tục với Facebook
      </Button>

      <Button
        onClick={() => continueWithMicrosoft()}
        variant={"outline"}
        className="w-full border-foreground hover:bg-foreground dark:hover:bg-foreground hover:text-background group"
      >
        <Image
          src={"/icons/microsoft.svg"}
          alt="Microsoft"
          width={24}
          height={24}
        />
        Tiếp tục với Microsoft
      </Button>
    </div>
  );
}
