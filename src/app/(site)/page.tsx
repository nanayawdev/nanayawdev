import { StructuredData } from "@/components/structured-data";
import { TechTicker } from "@/components/tech-ticker";
import { Services } from "@/components/services";
import { LatestWork } from "@/components/latest-work";
import { OurProcesses } from "@/components/our-processes";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FAQ } from "@/components/faq";
import { LatestInsights } from "@/components/latest-insights";
import { MainCTA } from "@/components/main-cta";
import type { Metadata } from "next";
import { NameHero } from "@/components/name-hero";

export const metadata: Metadata = {
  title: "nanayawdev - Software Engineer",
  description: "I'm a software engineer helping startups and brands go global through design, development, and storytelling. I empower brands with world-class digital experiences.",
  openGraph: {
    title: "nanayawdev - Software Engineer",
    description: "I'm a software engineer helping startups and brands go global through design, development, and storytelling.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <StructuredData />
      <NameHero />
      <TechTicker />
      <Services />
      <LatestWork />
      <OurProcesses />
      <TestimonialsSection />
      <FAQ />
      <LatestInsights />
      <MainCTA />
    </>
  );
}
