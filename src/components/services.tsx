export function Services() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Services</h2>
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
      </div>
    </section>
  );
}
