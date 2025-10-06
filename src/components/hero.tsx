export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-8">
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
      </main>
    </section>
  );
}
