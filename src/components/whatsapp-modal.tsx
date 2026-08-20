"use client";

import { useEffect, useState } from "react";
import { XIcon as X } from "@phosphor-icons/react";

const INVITE_URL = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL;
const SCROLL_TRIGGER_RATIO = 0.5;
const SNOOZE_DAYS = 7;
const LAST_SHOWN_KEY = "whatsapp-modal-last-shown";
const JOINED_KEY = "whatsapp-modal-joined";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.94-.93 1.14-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.71-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.2.05-.36-.02-.51-.08-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.51-.17-.01-.36-.01-.56-.01-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.19 3.03c.15.19 2.06 3.15 5 4.42.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.11.56-.08 1.73-.71 1.97-1.39.24-.68.24-1.27.17-1.39-.07-.13-.27-.2-.56-.34zM12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.85.5 3.58 1.37 5.07L2 22l5.08-1.33A9.96 9.96 0 0 0 12.02 22c5.52 0 10-4.48 10-10S17.54 2 12.02 2zm0 18.15c-1.66 0-3.2-.46-4.52-1.25l-.32-.19-3.02.79.81-2.94-.21-.31A8.15 8.15 0 0 1 3.85 12c0-4.5 3.66-8.15 8.17-8.15 4.5 0 8.15 3.65 8.15 8.15 0 4.5-3.65 8.15-8.15 8.15z" />
    </svg>
  );
}

export function WhatsAppModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!INVITE_URL) return;
    if (localStorage.getItem(JOINED_KEY)) return;

    const lastShown = Number(localStorage.getItem(LAST_SHOWN_KEY) ?? 0);
    if (Date.now() - lastShown < SNOOZE_DAYS * 24 * 60 * 60 * 1000) return;

    const onScroll = () => {
      const scrolled = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (scrolled / scrollable >= SCROLL_TRIGGER_RATIO) {
        setVisible(true);
        localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!INVITE_URL || !visible) return null;

  function dismiss() {
    setVisible(false);
  }

  function join() {
    localStorage.setItem(JOINED_KEY, "1");
    window.open(INVITE_URL, "_blank", "noopener,noreferrer");
    setVisible(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div className="relative w-full max-w-sm bg-background border border-border p-8 shadow-xl">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 flex h-11 w-11 items-center justify-center bg-[#25D366] text-white">
          <WhatsAppIcon className="h-6 w-6" />
        </div>

        <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Community
        </p>
        <h3 className="mb-2 text-lg font-bold text-foreground">Join the WhatsApp Community</h3>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          Get early access to new posts, dev tips, and a place to ask questions directly.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={join}
            className="bg-[#25D366] px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
          >
            Join Now
          </button>
          <button
            onClick={dismiss}
            className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
