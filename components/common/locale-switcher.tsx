"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "vi";

  const switchLocale = (newLocale: string) => {
    if (newLocale !== locale) {
      const segments = pathname.split("/");
      segments[1] = newLocale;
      router.replace(segments.join("/") || "/");
      router.refresh();
    }
  };

  const locales = [
    {
      code: "en",
      label: "English",
    },
    {
      code: "vi",
      label: "Tiếng Việt",
    },
  ];

  return (
    <Select value={locale} onValueChange={(value) => switchLocale(value)}>
      <SelectTrigger className="w-fit text-foreground border-none shadow-none text-md bg-transparent dark:bg-transparent p-0 dark:hover:bg-transparent">
        <Globe className="text-foreground size-5" />
        <SelectValue placeholder={"Chọn ngôn ngữ"} />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {locales.map((locale) => (
          <SelectItem key={locale.code} value={locale.code}>
            {locale.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
