"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface DashboardHeaderProps {
  rawBoardName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  rawBoardName,
}) => {
  const { t, getLocalizedBoardName } = useLanguage();

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold">
        {getLocalizedBoardName(rawBoardName)}
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        {t.dashboard.subtitle}
      </p>
    </div>
  );
};

export default DashboardHeader;
