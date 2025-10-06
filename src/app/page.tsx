import { ThemeToggle } from "@/components/theme-toggle";
import { StructuredData } from "@/components/structured-data";
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
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <main className="text-center">
        <h1 className="text-5xl text-foreground mb-4">
          Devs & Creatives
        </h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
          A digital agency helping African startups and brands go global through design, development, and storytelling.
        </p>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Empower African brands with world-class digital experiences that drive growth, inspire confidence, and connect with their audiences globally.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-12">
          <span className="px-3 py-1 bg-muted rounded-full">Where innovation meets imagination</span>
          <span className="px-3 py-1 bg-muted rounded-full">Building digital experiences that speak</span>
          <span className="px-3 py-1 bg-muted rounded-full">Creativity powered by code</span>
        </div>
        
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Development Division</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Website design & development (corporate, e-commerce, startup)</li>
                <li>• Web apps & digital platforms</li>
                <li>• Mobile app prototypes</li>
                <li>• API integration</li>
                <li>• Maintenance & hosting</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Creative Division</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Brand identity & design systems</li>
                <li>• UI/UX design</li>
                <li>• Motion graphics & 3D visuals</li>
                <li>• Social media design</li>
                <li>• Product packaging visuals</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <em>Coming soon: Copywriting, Digital marketing, and Product strategy for startups</em>
            </p>
          </div>
        </section>
      </main>
      </div>
    </>
  );
}
