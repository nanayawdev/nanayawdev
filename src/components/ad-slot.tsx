"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export type AdFormat =
  | "auto"           // responsive display ad
  | "rectangle"
  | "vertical"
  | "horizontal"
  | "in-article"     // fluid layout meant to sit inline between paragraphs
  | "in-feed"        // fluid layout for list/feed rows, needs layoutKey
  | "matched-content"; // native "you might also like" recommendation unit

interface AdSlotProps {
  /** Ad unit slot ID from the AdSense dashboard. Omit for auto ads. */
  slot?: string;
  format?: AdFormat;
  /** Required by AdSense for in-feed ads (the "data-ad-layout-key" value). */
  layoutKey?: string;
  className?: string;
  responsive?: boolean;
}

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

const FLUID_FORMATS: AdFormat[] = ["in-article", "in-feed"];

export function AdSlot({ slot, format = "auto", layoutKey, className = "", responsive = true }: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense script not loaded yet, blocked, offline, or no consent */
    }
  }, []);

  if (!CLIENT_ID) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <div className={`flex min-h-[90px] items-center justify-center border border-dashed border-border text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50 ${className}`}>
          Ad slot, {format}
        </div>
      );
    }
    return null;
  }

  const adFormat = format === "matched-content" ? "autorelaxed" : FLUID_FORMATS.includes(format) ? "fluid" : format;

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={CLIENT_ID}
      data-ad-format={adFormat}
      {...(slot ? { "data-ad-slot": slot } : {})}
      {...(format === "in-article" ? { "data-ad-layout": "in-article" } : {})}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      {...(responsive && !FLUID_FORMATS.includes(format) ? { "data-full-width-responsive": "true" } : {})}
    />
  );
}
