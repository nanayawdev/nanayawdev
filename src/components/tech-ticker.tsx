import LogoLoop from "./logo-loop";

const items = [
  { label: "branding.",    muted: false },
  { label: "strategy.",    muted: true  },
  { label: "web design.",  muted: false },
  { label: "marketing.",   muted: true  },
  { label: "mobile apps.", muted: false },
  { label: "identity.",    muted: true  },
  { label: "development.", muted: false },
  { label: "analysis.",    muted: true  },
  { label: "growth.",      muted: false },
  { label: "storytelling.", muted: true },
];

const tickerItems = items.map(({ label, muted }) => ({
  node: (
    <span className="flex items-center">
      <span
        className={`text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-tight whitespace-nowrap ${
          muted ? "text-foreground/20" : "text-foreground"
        }`}
      >
        {label}
      </span>
    </span>
  ),
}));

export function TechTicker() {
  return (
    <div className="w-full border-y border-border py-8 overflow-hidden">
      <LogoLoop
        logos={tickerItems}
        speed={40}
        direction="left"
        logoHeight={56}
        gap={80}
        pauseOnHover={false}
        fadeOut={false}
        ariaLabel="What I do"
      />
    </div>
  );
}
