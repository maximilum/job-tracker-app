"use client";

import Hero from "@/components/Hero";
import HeroImagesSection from "@/components/HeroImagesSection";
import { Briefcase, CheckCircle2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <main className="flex-1">
        {/* Hero */}
        <Hero />

        {/* Hero images section */}
        <HeroImagesSection />

        {/* Features */}
        <section className="border-t border-border">
          <div className="container my-24 px-6 sm:px-16 md:px-32 lg:px-64 mx-auto">
            <div className="flex flex-col gap-16">
              <article className="flex flex-col gap-3 pb-8 border-b border-border">
                <div className="text-primary bg-accent size-16 flex items-center justify-center rounded-sm">
                  <Briefcase className="size-10" />
                </div>
                <h3 className="font-semibold text-xl text-primary">
                  {t.landing.feature1Title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.landing.feature1Desc}
                </p>
              </article>
              <article className="flex flex-col gap-3 pb-8 border-b border-border">
                <div className="text-primary bg-accent size-16 flex items-center justify-center rounded-sm">
                  <CheckCircle2 className="size-10" />
                </div>
                <h3 className="font-semibold text-xl text-primary">
                  {t.landing.feature2Title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.landing.feature2Desc}
                </p>
              </article>
              <article className="flex flex-col gap-3 pb-8 border-b border-border">
                <div className="text-primary bg-accent size-16 flex items-center justify-center rounded-sm">
                  <TrendingUp className="size-10" />
                </div>
                <h3 className="font-semibold text-xl text-primary">
                  {t.landing.feature3Title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.landing.feature3Desc}
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
