import LogoLoop from "./logo-loop";

const items = [
  "MongoDB",
  "Node.js",
  "Redis",
  "Firebase",
  "OpenAI",
  "LangChain",
  "TestFlight",
  "Fastlane",
  "Mapbox",
  "Swift",
  "SwiftUI",
  "Kotlin",
  "Jetpack Compose",
  "Next.js",
  "React",
  "TypeScript",
  "PostgreSQL",
  "Supabase",
  "Figma",
  "Framer",
];

const tickerItems = items.map((label) => ({
  node: (
    <span className="flex items-center gap-16">
      <span className="text-sm font-medium text-foreground/70 whitespace-nowrap tracking-wide">
        {label}
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
    </span>
  ),
}));

export function TechTicker() {
  return (
    <div className="w-full border-y border-border/40 py-6 overflow-hidden">
      <LogoLoop
        logos={tickerItems}
        speed={60}
        direction="left"
        logoHeight={20}
        gap={48}
        pauseOnHover={false}
        fadeOut={false}
        ariaLabel="Technologies we work with"
      />
    </div>
  );
}
