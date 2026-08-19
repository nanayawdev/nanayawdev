"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Github, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { ChatBubble } from "@/components/chat-bubble";

const company = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Apps", href: "/apps" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

const services = [
  { label: "Web Design & Development", href: "/services" },
  { label: "Mobile Apps", href: "/services" },
  { label: "Brand Identity", href: "/services" },
  { label: "Digital Marketing", href: "/services" },
];

const socials = [
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/nanayawdev" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/nanayawdev" },
  { icon: Github, label: "GitHub", href: "https://github.com/nanayawdev" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/nanayawdev" },
];

const footerColumns = [
  {
    title: "Studio",
    links: company,
  },
  {
    title: "Services",
    links: services,
  },
  {
    title: "Resources",
    links: [
      { label: "Start a Project", href: "/start" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  const [email, setEmail]       = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubState(res.ok ? "done" : "error");
    } catch {
      setSubState("error");
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background text-foreground">
      <div className="border-b border-border bg-[#cdf68c] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="block text-center text-[clamp(2.25rem,10vw,13.5rem)] font-semibold leading-[0.8] tracking-[-0.09em] text-[#0a291a]"
          aria-label="nanayawdev home"
        >
          nanayaw.dev
        </Link>
      </div>

      <div className="grid border-b border-border lg:grid-cols-[minmax(260px,0.85fr)_1fr]">
        <div className="border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <p className="mb-6 text-[0.7rem] font-medium tracking-[0.18em] text-muted-foreground">
            Newsletter
          </p>
          <form className="max-w-xs" onSubmit={handleSubscribe}>
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            {subState === "done" ? (
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#0a291a]">
                You&apos;re subscribed!
              </p>
            ) : (
              <>
                <div className="flex items-center border-b border-border pb-2">
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="min-w-0 flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/70 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={subState === "loading"}
                    className="ml-3 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                {subState === "error" && (
                  <p className="mt-2 text-[0.55rem] uppercase tracking-[0.18em] text-red-500">
                    Something went wrong. Try again.
                  </p>
                )}
                <p className="mt-3 text-[0.55rem] uppercase tracking-[0.18em] text-muted-foreground/70">
                  Subscribe for digital insights
                </p>
              </>
            )}
          </form>

          <div className="mt-8 flex items-center gap-4">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 p-6 sm:grid-cols-3 sm:p-8 lg:px-12">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="mb-5 text-[0.7rem] font-medium tracking-[0.18em] text-muted-foreground">
                {column.title}
              </p>
              <ul className="space-y-2">
                {column.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-xs leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
          Copyright nanayawdev {new Date().getFullYear()}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.65rem] text-muted-foreground">
          <a
            href="mailto:hello@nanayawdev.com"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Mail className="h-3 w-3" />
            hello@nanayawdev.com
          </a>
          <Link href="/start" className="transition-colors hover:text-foreground">
            Start a project
          </Link>
        </div>
      </div>

      <ChatBubble />
    </footer>
  );
}
