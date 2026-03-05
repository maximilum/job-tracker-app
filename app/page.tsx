import { Button } from "@/components/ui/button";
import { ArrowBigRight, ArrowRight } from "lucide-react";
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
                <Button
                  size={"xl"}
                  className=" h-16 px-16 font-semibold text-md"
                >
                  Start Free <ArrowBigRight className="ml-2 size-6" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                it will always be free, No credit card. No trials. No catch.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
