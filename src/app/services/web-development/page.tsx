import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Development Services - Devs & Creatives",
  description: "Professional web development services for African startups and brands. Custom websites, e-commerce, and web applications.",
};

export default function WebDevelopment() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Web Development</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Custom web development solutions that help African startups and brands establish a strong online presence and reach global audiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Our Web Development Services</h2>
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Corporate Websites</h3>
                <p className="text-muted-foreground">
                  Professional corporate websites that establish credibility and showcase your brand to global audiences.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">E-commerce Platforms</h3>
                <p className="text-muted-foreground">
                  Complete online stores with payment integration, inventory management, and customer experience optimization.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground mb-3">Startup Websites</h3>
                <p className="text-muted-foreground">
                  Fast, scalable websites designed to grow with your startup and attract investors and customers.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Technologies We Use</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-foreground">Frontend</h4>
                <p className="text-sm text-muted-foreground">React, Next.js, Vue.js</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-foreground">Backend</h4>
                <p className="text-sm text-muted-foreground">Node.js, Python, PHP</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-foreground">Database</h4>
                <p className="text-sm text-muted-foreground">PostgreSQL, MongoDB</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-foreground">Cloud</h4>
                <p className="text-sm text-muted-foreground">AWS, Vercel, Netlify</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Build Your Website?</h2>
          <p className="mb-6">Let's discuss your project and create a web solution that drives results.</p>
          <button className="bg-white text-primary px-6 py-3 rounded-md hover:bg-gray-100 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
