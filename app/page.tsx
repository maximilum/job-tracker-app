import HeroImagesSection from "@/components/HeroImagesSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowBigRight,
  ArrowRight,
  Briefcase,
  Car,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className=" flex flex-col bg-background min-h-screen">
      <main className="flex-1">
        {/* Hero section */}
        <section className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center ">
            <h1 className="font-extrabold text-6xl mb-6">
              Never Lose <span className="text-muted-foreground">Track</span> of
              an Opportunity Again
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              From first application to final offer, manage your entire job
              search journey in one beautiful dashboard. Set reminders, track
              progress, and never let another opportunity slip through the
              cracks.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/sign-up">
                <Button size="xl" className=" font-semibold text-xl">
                  Start Free <ArrowBigRight className="ml-2 size-8" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                it will always be free, No credit card. No trials. No catch.
              </p>
            </div>
          </div>
        </section>

        {/* Hero images section */}
        <HeroImagesSection></HeroImagesSection>

        {/* Features */}
        <section className="border-t border-border">
          <div className="container my-24 px-16 sm:px-16 md:px-32 lg:px-64 mx-auto ">
            <div className="flex flex-col gap-16">
              <article className="flex flex-col gap-2 border-b border-border">
                <div className="text-primary bg-accent size-16 flex items-center justify-center rounded-sm">
                  <Briefcase className="size-10" />
                </div>
                <h3 className="text-semibold text-lg text-primary">
                  Organize Applications
                </h3>

                <p>
                  Create custom boards and columns to track your job
                  applications at every stage of the process.
                </p>
              </article>
              <article className="flex flex-col gap-2 border-b border-border">
                <div className="text-primary bg-accent size-16 flex items-center justify-center rounded-sm">
                  <CheckCircle2 className="size-10" />
                </div>
                <h3 className="text-semibold text-lg text-primary">
                  Stay Organized
                </h3>

                <p>
                  Never lose track of an application. Keep all your job search
                  information in one centralized place.
                </p>
              </article>
              <article className="flex flex-col gap-2 border-b border-border">
                <div className="text-primary bg-accent size-16 flex items-center justify-center rounded-sm">
                  <TrendingUp className="size-10" />
                </div>
                <h3 className="text-semibold text-lg text-primary">
                  Track Progress
                </h3>

                <p>
                  Monitor your application status from applied to interview to
                  offer with visual Kanban boards.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
