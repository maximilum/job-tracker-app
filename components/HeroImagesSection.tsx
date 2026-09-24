"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const HeroImagesSection = () => {
  const [activeTab, setActiveTab] = useState("hire"); //organize || hire || board
  const { t } = useLanguage();

  return (
    <section className="border-t border-border">
      <div className="container mx-auto px-4 my-24 flex flex-col items-center">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          <Button
            onClick={() => setActiveTab("organize")}
            size={"lg"}
            className={`text-sm p-4 sm:text-base sm:px-8 sm:py-4 ${
              activeTab === "organize"
                ? ""
                : "bg-secondary text-gray-600 hover:text-white hover:bg-primary/50"
            }`}
          >
            {t.landing.tabOrganize}
          </Button>
          <Button
            onClick={() => setActiveTab("board")}
            size={"lg"}
            className={`text-sm px-4 py-4 sm:text-base sm:px-8 ${
              activeTab === "board"
                ? ""
                : "bg-secondary text-gray-600 hover:text-white hover:bg-primary/50"
            }`}
          >
            {t.landing.tabManageBoards}
          </Button>
          <Button
            onClick={() => setActiveTab("hire")}
            size={"lg"}
            className={`text-sm p-4 sm:text-base sm:px-8 sm:py-4 ${
              activeTab === "hire"
                ? ""
                : "bg-secondary text-gray-600 hover:text-white hover:bg-primary/50"
            }`}
          >
            {t.landing.tabGetHired}
          </Button>
        </div>
        {/* images */}
        <div className="max-w-5xl mx-auto overflow-hidden border border-border shadow-lg rounded-sm">
          {activeTab === "organize" && (
            <Image
              src="/hero-images/newhero1.png"
              alt={t.landing.tabOrganize}
              width={1200}
              height={800}
            />
          )}
          {activeTab === "hire" && (
            <Image
              src="/hero-images/newhero2.png"
              alt={t.landing.tabGetHired}
              width={1200}
              height={800}
            />
          )}
          {activeTab === "board" && (
            <Image
              src="/hero-images/newhero3.png"
              alt={t.landing.tabManageBoards}
              width={1200}
              height={800}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroImagesSection;
