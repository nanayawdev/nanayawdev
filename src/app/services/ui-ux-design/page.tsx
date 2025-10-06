import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UI/UX Design Services - Devs & Creatives",
  description: "Professional UI/UX design services for African startups and brands. User-centered design that drives engagement and conversions.",
};

export default function UIUXDesign() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">UI/UX Design</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            User-centered design solutions that create engaging digital experiences and drive conversions for African startups and brands.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Our Design Process</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">1</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Research & Discovery</h3>
                  <p className="text-muted-foreground">Understanding your users, business goals, and market context.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">2</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Wireframing & Prototyping</h3>
                  <p className="text-muted-foreground">Creating low-fidelity wireframes and interactive prototypes.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">3</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Visual Design</h3>
                  <p className="text-muted-foreground">Creating beautiful, on-brand visual designs and design systems.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">4</div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Testing & Iteration</h3>
                  <p className="text-muted-foreground">User testing and continuous improvement based on feedback.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Design Services</h2>
            <div className="space-y-4">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">User Interface Design</h3>
                <p className="text-muted-foreground">
                  Clean, intuitive interfaces that guide users through your digital products seamlessly.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">User Experience Design</h3>
                <p className="text-muted-foreground">
                  Strategic UX design that improves user satisfaction and drives business results.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Design Systems</h3>
                <p className="text-muted-foreground">
                  Comprehensive design systems that ensure consistency across all touchpoints.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Design Tools & Technologies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg text-center">
              <h4 className="font-semibold text-foreground">Figma</h4>
            </div>
            <div className="bg-card p-4 rounded-lg text-center">
              <h4 className="font-semibold text-foreground">Adobe Creative Suite</h4>
            </div>
            <div className="bg-card p-4 rounded-lg text-center">
              <h4 className="font-semibold text-foreground">Sketch</h4>
            </div>
            <div className="bg-card p-4 rounded-lg text-center">
              <h4 className="font-semibold text-foreground">Principle</h4>
            </div>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Improve Your User Experience?</h2>
          <p className="mb-6">Let's create designs that your users will love and that drive your business forward.</p>
          <button className="bg-white text-primary px-6 py-3 rounded-md hover:bg-gray-100 transition-colors">
            Start Your Project
          </button>
        </div>
      </div>
    </div>
  );
}
