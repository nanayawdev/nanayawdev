import { StructuredData } from "@/components/structured-data";
import { TechTicker } from "@/components/tech-ticker";
import { Services } from "@/components/services";
import { LatestWork } from "@/components/latest-work";
import { OurProcesses } from "@/components/our-processes";
import { FAQ } from "@/components/faq";
import { MainCTA } from "@/components/main-cta";
import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";

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
      <AboutSection />
      <TechTicker />
      <Services />
      <LatestWork />
      <OurProcesses />
      <FAQ />
      <MainCTA />
    </>
  );
}
