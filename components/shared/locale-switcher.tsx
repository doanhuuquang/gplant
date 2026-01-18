"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Languages");

  const switchLocale = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    }
  };

  const locales = [
    {
      code: "en",
      label: t("English"),
    },
    {
      code: "vi",
      label: t("Vietnamese"),
    },
  ];

  return (
    <Select value={locale} onValueChange={(value) => switchLocale(value)}>
      <SelectTrigger className="w-fit text-foreground border-none shadow-none text-md bg-transparent dark:bg-transparent p-0 dark:hover:bg-transparent">
        <Globe className="text-foreground size-5" />
        <SelectValue placeholder={t("SelectLanguage")} />
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
