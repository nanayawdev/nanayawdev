import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio - Devs & Creatives",
  description: "Explore our portfolio of successful projects helping African startups and brands go global. See our web development, design, and digital solutions.",
};

export default function Portfolio() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Portfolio</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing our successful projects that have helped African startups and brands achieve global reach through innovative digital solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Project Image {item}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Project Title {item}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Brief description of the project and the impact it had on the client&apos;s business.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Web Development</span>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">UI/UX Design</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">Ready to see your project here?</p>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
            Start Your Project
          </button>
        </div>
      </div>
    </div>
  );
}
