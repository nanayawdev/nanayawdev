import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Devs & Creatives",
  description: "Learn about Devs & Creatives, a digital agency helping African startups and brands go global through design, development, and storytelling.",
};

export default function About() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">About Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We are Devs & Creatives, a digital agency passionate about helping African startups and brands achieve global success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              Empower African brands with world-class digital experiences that drive growth, inspire confidence, and connect with their audiences globally.
            </p>
            <p className="text-muted-foreground">
              We believe that African startups and brands have incredible potential to compete on the global stage. Our mission is to provide them with the digital tools and creative solutions they need to succeed.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Our Vision</h2>
            <p className="text-muted-foreground mb-6">
              To be the leading digital agency that bridges the gap between African innovation and global market success.
            </p>
            <p className="text-muted-foreground">
              We envision a future where African brands are not just participants in the global digital economy, but leaders and innovators that shape its direction.
            </p>
          </div>
        </div>

        <div className="bg-muted/30 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl">💡</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Innovation</h3>
              <p className="text-muted-foreground text-sm">We embrace cutting-edge technologies and creative solutions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Collaboration</h3>
              <p className="text-muted-foreground text-sm">We work closely with our clients as partners in their success.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground text-2xl">🌍</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Global Impact</h3>
              <p className="text-muted-foreground text-sm">We&apos;re committed to helping African brands reach global audiences.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Ready to Work With Us?</h2>
          <p className="text-muted-foreground mb-8">
            Let&apos;s discuss how we can help your brand go global.
          </p>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  );
}
