import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTACard() {
  return (
    <div className="relative overflow-hidden border border-border bg-foreground p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold leading-snug text-background mb-3">
          Ready to build something great?
        </h3>
        <p className="text-sm leading-relaxed text-background/60">
          Tell me about your project and I&apos;ll get back within 24 hours.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/start"
          className="flex items-center gap-2 bg-[#542e7b] px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
        >
          Start a Project
        </Link>
        <Link
          href="/case-studies"
          className="flex h-10 w-10 items-center justify-center border border-background/20 text-background transition-colors hover:bg-background/10"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
