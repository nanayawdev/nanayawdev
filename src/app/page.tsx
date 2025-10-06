import { StructuredData } from "@/components/structured-data";
import { Hero } from "@/components/hero";
import { Clients } from "@/components/clients";
import { Services } from "@/components/services";
import { LatestWork } from "@/components/latest-work";
import { WhyUs } from "@/components/why-us";
import { OurProcesses } from "@/components/our-processes";
import { FAQ } from "@/components/faq";
import { MainCTA } from "@/components/main-cta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devs & Creatives - Digital Agency for African Startups & Brands",
  description: "A digital agency helping African startups and brands go global through design, development, and storytelling. We empower African brands with world-class digital experiences.",
  openGraph: {
    title: "Devs & Creatives - Digital Agency for African Startups & Brands",
    description: "A digital agency helping African startups and brands go global through design, development, and storytelling.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <StructuredData />
      <Hero />
      <Clients />
      <Services />
      <LatestWork />
      <WhyUs />
      <OurProcesses />
      <FAQ />
      <MainCTA />
    </>
  );
}
