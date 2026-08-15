import LogoLoop from "./logo-loop";

const items = [
  { label: "web development.", muted: false },
  { label: "react.",           muted: true  },
  { label: "mobile apps.",     muted: false },
  { label: "next.js.",         muted: true  },
  { label: "ui/ux design.",    muted: false },
  { label: "typescript.",      muted: true  },
  { label: "brand identity.",  muted: false },
  { label: "node.js.",         muted: true  },
  { label: "full-stack.",      muted: false },
  { label: "product design.",  muted: true  },
];

const tickerItems = items.map(({ label, muted }) => ({
  node: (
    <span className="flex items-center">
      <span
        className={`text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.2] tracking-tight whitespace-nowrap ${
          muted ? "text-[#0a291a]/30" : "text-[#0a291a]"
        }`}
      >
        {label}
      </span>
    </span>
  ),
}));

export function TechTicker() {
  return (
    <div className="w-full border-y border-border bg-[#cdf68c] py-8 overflow-x-hidden">
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
