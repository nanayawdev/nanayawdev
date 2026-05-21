import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function ChatBubble() {
  return (
    <Link
      href="/start"
      aria-label="Contact Devs and Creatives"
      className="fixed bottom-4 right-4 z-50 hidden h-12 w-12 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-muted sm:flex"
    >
      <MessageCircle className="h-4 w-4" />
    </Link>
  );
}
