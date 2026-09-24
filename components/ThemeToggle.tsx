"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const ThemeToggle = () => {
  const { t } = useLanguage();

  const toggleTheme = () => {
    // classList.toggle returns true when the class is now present
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("app_theme", isDark ? "dark" : "light");
    } catch {}
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={t.common.themeToggle}
      title={t.common.themeToggle}
      className="cursor-pointer select-none"
    >
      <Sun className="hidden dark:block size-4 shrink-0" />
      <Moon className="dark:hidden size-4 shrink-0" />
    </Button>
  );
};

export default ThemeToggle;
