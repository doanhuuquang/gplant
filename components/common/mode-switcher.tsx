"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const themes = [
  {
    value: "system",
    name: "Hệ thống",
    icon: Laptop,
  },
  {
    value: "light",
    name: "Sáng",
    icon: Sun,
  },
  {
    value: "dark",
    name: "Tối",
    icon: Moon,
  },
];

export function ModeSwitcher() {
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const CurrentIcon = themes.find((t) => t.value === theme)?.icon;

  if (!mounted) {
    return (
      <Select>
        <SelectTrigger className="w-fit text-foreground border-none shadow-none text-md bg-transparent dark:bg-transparent dark:hover:bg-transparent p-0">
          <SelectValue placeholder={"Chọn giao diện"} />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={theme} onValueChange={(value) => setTheme(value)}>
      <SelectTrigger className="w-fit text-foreground border-none shadow-none text-md bg-transparent dark:bg-transparent dark:hover:bg-transparent p-0">
        {CurrentIcon && <CurrentIcon className="text-foreground size-5" />}
        <SelectValue placeholder={"Chọn giao diện"} />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {themes.map((theme) => (
          <SelectItem key={theme.value} value={theme.value}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
