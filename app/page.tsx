"use client";

import HeroImagesSection from "@/components/HeroImagesSection";
import { Button } from "@/components/ui/button";
import {
  ArrowBigRight,
  Briefcase,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <main className="flex-1">
        {/* Hero section */}
        <section className="container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-extrabold text-4xl sm:text-6xl mb-6 leading-tight">
              {t.landing.heroTitleStart}
              <span className="text-muted-foreground">
                {t.landing.heroTitleHighlight}
              </span>
              {t.landing.heroTitleEnd}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto">
              {t.landing.heroSubtitle}
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/sign-up">
                <Button size="xl" className="font-semibold text-xl gap-2">
                  <span>{t.landing.startFree}</span>
                  <ArrowBigRight className="size-8 rtl:rotate-180 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                {t.landing.freeNotice}
              </p>
            </div>
          </div>
        </section>

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
