import LogoLoop from "./logo-loop";

const clientLogos = [
  { src: "/cohere_wordmark.svg", alt: "Cohere", href: "https://cohere.com" },
  { src: "/deepseek_wordmark.svg", alt: "DeepSeek", href: "https://deepseek.com" },
  { src: "/LottieFiles_wordmark_dark.svg", alt: "LottieFiles", href: "https://lottiefiles.com" },
  { src: "/Perplexity AI_wordmark_dark.svg", alt: "Perplexity AI", href: "https://perplexity.ai" },
];

export function Clients() {
  return (
    <section className="py-6 lg:py-12 bg-primary-background">
      <div className="max-w-7xl mx-auto px-8 text-center">
        <LogoLoop
          logos={clientLogos}
          speed={100}
          direction="left"
          logoHeight={32}
          gap={48}
          pauseOnHover={true}
          fadeOut={true}
          scaleOnHover={true}
          ariaLabel="Client logos"
        />
      </div>
    </section>
  );
}
