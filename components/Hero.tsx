"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import SocialAuthButtons from "./SocialAuthButtons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [authError, setAuthError] = useState("");

  const handleEmailStart = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    router.push(
      trimmed ? `/sign-up?email=${encodeURIComponent(trimmed)}` : "/sign-up",
    );
  };

  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      {/* Faint accent wash, derived from the primary token so it tracks both themes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,color-mix(in_oklch,var(--primary)_7%,transparent),transparent_72%)]"
      />

      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <span className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700">
          {t.landing.heroEyebrow}
        </span>

        <h1 className="mt-6 text-5xl font-extrabold leading-[1.2] sm:text-6xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          {t.landing.heroTitle}{" "}
          <span className="text-primary">{t.landing.heroTitleAccent}</span>
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-100 motion-safe:duration-700">
          {t.landing.heroSubtitle}
        </p>

        <div className="mt-10 w-full max-w-sm motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-200 motion-safe:duration-700">
          <SocialAuthButtons onError={setAuthError} />
          {authError && (
            <p className="mt-3 text-xs text-destructive">{authError}</p>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-3 text-muted-foreground">
                {t.landing.orContinueWithEmail}
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailStart} className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.landing.emailCapturePlaceholder}
              aria-label={t.landing.emailCapturePlaceholder}
              className="h-11 flex-1"
            />
            <Button type="submit" size="lg" className="h-11 px-5 font-semibold">
              {t.landing.startFree}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
