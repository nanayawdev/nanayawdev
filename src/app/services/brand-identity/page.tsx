import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Identity Services - Devs & Creatives",
  description: "Complete brand identity and design system services for African startups and brands. Create a memorable brand that resonates globally.",
};

export default function BrandIdentity() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Brand Identity</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete brand identity solutions that help African startups and brands create memorable, impactful identities that resonate with global audiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Brand Identity Services</h2>
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Logo Design</h3>
                <p className="text-muted-foreground">
                  Unique, memorable logos that capture your brand essence and work across all platforms.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Brand Guidelines</h3>
                <p className="text-muted-foreground">
                  Comprehensive brand guidelines ensuring consistent application across all touchpoints.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Color Palette</h3>
                <p className="text-muted-foreground">
                  Strategic color systems that evoke the right emotions and support your brand message.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Typography</h3>
                <p className="text-muted-foreground">
                  Custom typography selections that enhance readability and brand personality.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Design System Development</h2>
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Component Library</h3>
                <p className="text-muted-foreground">
                  Reusable design components that maintain consistency across digital products.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Style Guide</h3>
                <p className="text-muted-foreground">
                  Detailed style guides for developers and designers to implement your brand correctly.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Brand Assets</h3>
                <p className="text-muted-foreground">
                  Complete set of brand assets including logos, icons, and visual elements.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Brand Identity Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-xl">🔍</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Discovery</h3>
              <p className="text-sm text-muted-foreground">Understanding your brand, values, and target audience.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-xl">💡</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Concept</h3>
              <p className="text-sm text-muted-foreground">Developing initial concepts and visual directions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-xl">🎨</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Design</h3>
              <p className="text-sm text-muted-foreground">Creating final designs and brand elements.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-xl">📋</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Guidelines</h3>
              <p className="text-sm text-muted-foreground">Delivering comprehensive brand guidelines.</p>
            </div>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Build Your Brand Identity?</h2>
          <p className="mb-6">Let&apos;s create a brand that stands out and connects with your global audience.</p>
          <button className="bg-white text-primary px-6 py-3 rounded-md hover:bg-gray-100 transition-colors">
            Start Your Brand
          </button>
        </div>
      </div>
    </div>
  );
}
