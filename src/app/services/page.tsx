import type { Metadata } from "next";
import { Services } from "@/components/services";
import { LatestWork } from "@/components/latest-work";
import { WhyUs } from "@/components/why-us";
import { FAQ } from "@/components/faq";
import { MainCTA } from "@/components/main-cta";

export const metadata: Metadata = {
  title: "Services - Devs & Creatives",
  description: "Explore our comprehensive digital services including web development, UI/UX design, mobile apps, brand identity, and more. Helping African startups go global.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28">
        <div className="flex flex-col">
          {/* Top Content - Centered */}
          <div className="min-h-[25vh] sm:min-h-[30vh] lg:min-h-[35vh] flex items-end justify-center py-4 sm:py-6 lg:py-16">
            <div className="max-w-5xl text-foreground text-center">
              {/* Main Header */}
              <div>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">Our Services</h1>
                <p className="text-sm lg:text-base text-muted-foreground max-w-3xl mx-auto">
                  Comprehensive digital solutions to help African startups and brands go global through design, development, and storytelling.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom - Components */}
          <div className="pb-10 lg:pb-12">
            <Services />
            <LatestWork />
            <WhyUs />
            <FAQ />
            <MainCTA />
          </div>
        </div>
      </div>
    </div>
  );
}
