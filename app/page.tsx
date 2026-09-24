"use client";

import Link from "next/link";
import Hero from "@/components/Hero";
import DemoBoard from "@/components/DemoBoard";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CheckCircle2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="h-[calc(100dvh-4rem)] snap-y snap-proximity overflow-y-auto overscroll-contain bg-background">
      {/* Screen 1: Hero with signup */}
      <Hero />

      {/* Screen 2: interactive demo board */}
      <section className="flex min-h-[calc(100dvh-4rem)] snap-start flex-col justify-center px-4 pt-10 pb-14 lg:snap-stop-always">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold sm:text-4xl">
                {t.landing.demoTitle}
              </h2>
              <Badge variant="secondary">{t.landing.demoDataBadge}</Badge>
            </div>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
              {t.landing.demoSubtitle}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
            <DemoBoard />
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            <Link
              href="/sign-up"
              className="font-medium text-primary underline underline-offset-4"
            >
              {t.landing.demoSaveCta}
            </Link>
          </p>
        </div>
      </section>

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
  );
}
