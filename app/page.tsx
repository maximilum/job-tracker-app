"use client";

import Link from "next/link";
import Hero from "@/components/Hero";
import DemoBoard from "@/components/DemoBoard";
import { Badge } from "@/components/ui/badge";
import { Kanban, ListChecks, TrendingUp } from "lucide-react";
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

      {/* Features: asymmetric grid, one accent moment */}
      <section className="px-4 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            {t.landing.featuresTitle}
          </h2>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <article className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:gap-8 md:col-span-2">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Kanban className="size-7" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {t.landing.feature1Title}
                </h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
                  {t.landing.feature1Desc}
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-border bg-card p-8">
              <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <ListChecks className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">
                {t.landing.feature2Title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.landing.feature2Desc}
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-card p-8">
              <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <TrendingUp className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">
                {t.landing.feature3Title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.landing.feature3Desc}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between text-sm text-muted-foreground">
          <span className="font-medium">{t.nav.appName}</span>
          <Link
            href="/sign-in"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            {t.nav.signIn}
          </Link>
        </div>
      </footer>
    </main>
  );
}
