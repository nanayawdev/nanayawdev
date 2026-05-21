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
      <div className="max-w-7xl mx-auto px-8 pt-40 lg:pt-52 pb-24">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
          Services
        </p>
        <h1 className="max-w-3xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground mb-6">
          Our Services
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mb-20">
          Comprehensive digital solutions to help African startups and brands go global through design, development, and storytelling.
        </p>
      </div>
      <Services />
      <LatestWork />
      <WhyUs />
      <FAQ />
      <MainCTA />
    </div>
  );
}
