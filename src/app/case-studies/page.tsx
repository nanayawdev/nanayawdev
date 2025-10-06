import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies - Devs & Creatives",
  description: "Explore detailed case studies of our successful projects helping African startups and brands achieve global success through digital solutions.",
};

export default function CaseStudies() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Case Studies</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Deep dive into our successful projects and the impact we&apos;ve made helping African startups and brands go global.
          </p>
        </div>

        <div className="space-y-16">
          {[1, 2, 3].map((study) => (
            <div key={study} className="bg-card rounded-lg border overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Case Study Image {study}</span>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Web Development</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">UI/UX Design</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Case Study {study}: Project Title</h2>
                  <p className="text-muted-foreground mb-6">
                    Brief description of the project, the challenges faced, and the solutions implemented. 
                    This case study showcases how we helped an African startup achieve global reach through innovative digital solutions.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Client</h4>
                      <p className="text-muted-foreground text-sm">African Startup</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Timeline</h4>
                      <p className="text-muted-foreground text-sm">3 months</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Industry</h4>
                      <p className="text-muted-foreground text-sm">Technology</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Result</h4>
                      <p className="text-muted-foreground text-sm">300% Growth</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">Key Results:</h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">✓</span>
                        Increased user engagement by 250%
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">✓</span>
                        Expanded to 5 new markets
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">✓</span>
                        Improved conversion rate by 180%
                      </li>
                    </ul>
                  </div>
                  
                  <button className="mt-6 text-primary hover:text-primary/80 transition-colors">
                    Read Full Case Study →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Want to See Your Success Story Here?</h2>
          <p className="text-muted-foreground mb-8">
            Let&apos;s work together to create your own success story.
          </p>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
            Start Your Project
          </button>
        </div>
      </div>
    </div>
  );
}
