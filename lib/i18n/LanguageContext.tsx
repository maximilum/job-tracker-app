"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Language,
  Direction,
  translations,
  Translations,
  getLocalizedColumnName as localizeColumn,
  getLocalizedBoardName as localizeBoard,
} from "./translations";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  getLocalizedColumnName: (name: string) => string;
  getLocalizedBoardName: (name: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "app_lang";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Default to Arabic first as requested
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang === "en" || savedLang === "ar") {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
        document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
      } else {
        // Arabic first default
        document.documentElement.lang = "ar";
        document.documentElement.dir = "rtl";
      }
    } catch {
      // localStorage may fail in restricted environments
    }
  }, []);

  const updateDocumentAttributes = useCallback((lang: Language) => {
    const dir: Direction = lang === "ar" ? "rtl" : "ltr";
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.cookie = `${STORAGE_KEY}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = useCallback(
    (newLang: Language) => {
      setLanguageState(newLang);
      updateDocumentAttributes(newLang);
    },
    [updateDocumentAttributes],
  );

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const nextLang = prev === "ar" ? "en" : "ar";
      updateDocumentAttributes(nextLang);
      return nextLang;
    });
  }, [updateDocumentAttributes]);

  const direction: Direction = language === "ar" ? "rtl" : "ltr";
  const t = translations[language];

  const getLocalizedColumnName = useCallback(
    (name: string) => localizeColumn(name, language),
    [language],
  );

  const getLocalizedBoardName = useCallback(
    (name: string) => localizeBoard(name, language),
    [language],
  );

  const contextValue = useMemo(
    () => ({
      language,
      direction,
      setLanguage,
      toggleLanguage,
      t,
      getLocalizedColumnName,
      getLocalizedBoardName,
    }),
    [
      language,
      direction,
      setLanguage,
      toggleLanguage,
      t,
      getLocalizedColumnName,
      getLocalizedBoardName,
    ],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
