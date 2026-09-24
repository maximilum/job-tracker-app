"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "./ui/button";
import { Languages } from "lucide-react";

interface LanguageToggleProps {
  className?: string;
  variant?: "outline" | "ghost" | "default" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = "",
  variant = "outline",
  size = "sm",
}) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 font-medium transition-colors cursor-pointer select-none ${className}`}
      aria-label={
        language === "ar"
          ? "Switch to English (LTR)"
          : "التبديل إلى العربية (RTL)"
      }
      title={
        language === "ar"
          ? "Switch to English (LTR)"
          : "التبديل إلى العربية (RTL)"
      }
    >
      <Languages className="size-4 shrink-0 text-primary" />
      <span className="text-xs">
        {language === "ar" ? "English (LTR)" : "العربية (RTL)"}
      </span>
    </Button>
  );
};

export default LanguageToggle;
