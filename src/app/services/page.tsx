import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - Devs & Creatives",
  description: "Explore our comprehensive digital services including web development, UI/UX design, mobile apps, brand identity, and more. Helping African startups go global.",
};

export default function Services() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive digital solutions to help African startups and brands go global through design, development, and storytelling.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card p-8 rounded-lg border">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Development Division</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                <div>
                  <h3 className="font-semibold text-foreground">Website Design & Development</h3>
                  <p className="text-sm">Corporate, e-commerce, and startup websites</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                <div>
                  <h3 className="font-semibold text-foreground">Web Apps & Digital Platforms</h3>
                  <p className="text-sm">Custom web applications and digital solutions</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                <div>
                  <h3 className="font-semibold text-foreground">Mobile App Prototypes</h3>
                  <p className="text-sm">iOS and Android app development</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                <div>
                  <h3 className="font-semibold text-foreground">API Integration</h3>
                  <p className="text-sm">Third-party integrations and API development</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                <div>
                  <h3 className="font-semibold text-foreground">Maintenance & Hosting</h3>
                  <p className="text-sm">Ongoing support and reliable hosting solutions</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-card p-8 rounded-lg border">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Creative Division</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                <div>
                  <h3 className="font-semibold text-foreground">Brand Identity & Design Systems</h3>
                  <p className="text-sm">Complete brand identity and design system development</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                <div>
                  <h3 className="font-semibold text-foreground">UI/UX Design</h3>
                  <p className="text-sm">User interface and user experience design</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                <div>
                  <h3 className="font-semibold text-foreground">Motion Graphics & 3D Visuals</h3>
                  <p className="text-sm">Animated graphics and 3D visual content</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                <div>
                  <h3 className="font-semibold text-foreground">Social Media Design</h3>
                  <p className="text-sm">Social media graphics and content design</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary">•</span>
                <div>
                  <h3 className="font-semibold text-foreground">Product Packaging Visuals</h3>
                  <p className="text-sm">Packaging design and visual identity</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-muted/30 p-8 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            We&apos;re expanding our services to include:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full">Copywriting</span>
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full">Digital Marketing</span>
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full">Product Strategy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
