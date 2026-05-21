import Link from "next/link";
import { Phone } from "lucide-react";

export function ChatBubble() {
  return (
    <Link
      href="/start"
      aria-label="Speak to an AI Agent"
      className="fixed bottom-6 right-6 z-50 hidden items-center gap-2.5 border border-border bg-background px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm transition-colors hover:bg-muted sm:flex"
    >
      <Phone className="h-3.5 w-3.5 shrink-0" />
      Speak to an Agent
    </Link>
  );
}
