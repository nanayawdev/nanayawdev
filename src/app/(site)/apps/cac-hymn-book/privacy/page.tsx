"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `This Privacy Policy describes how CAC Hymn Book ("the app"), developed by nanayawdev, handles information when you use the app on Android. It's separate from the privacy policy for nanayawdev.com, this page covers the app specifically. By using CAC Hymn Book, you agree to the practices described here.`,
  },
  {
    id: "information-we-collect",
    title: "Information the App Collects",
    content: `CAC Hymn Book does not require an account or sign-in, and does not collect your name, email, or any personal information. Hymns, favorites, and settings are stored locally on your device only, nothing is uploaded to a server I control. The only data collection that happens is through Google AdMob, described below, which serves the ads that support the app.`,
  },
  {
    id: "admob",
    title: "Advertising (Google AdMob)",
    content: `CAC Hymn Book uses Google AdMob to display ads. To do this, AdMob's SDK may collect data such as your advertising ID, IP address, device information, approximate location, and ad interaction activity, to serve and measure ads and prevent fraud. This data is collected and processed by Google, not by me. You can review how Google handles this data in Google's Privacy Policy (policies.google.com/privacy) and Google's Ads Policy. You can limit ad personalization on your device under Android Settings → Google → Ads → Opt out of Ads Personalization.`,
  },
  {
    id: "childrens-privacy",
    title: "Children's Privacy",
    content: `CAC Hymn Book is intended for a general audience and is not directed at children under 13. I do not knowingly collect personal information from children. If you believe a child has provided personal information through the app, please contact me using the details below and I will address it.`,
  },
  {
    id: "data-sharing",
    title: "Data Sharing",
    content: `I don't sell, rent, or trade any data, and I don't have a server that stores user data from this app to share in the first place. The only third party involved is Google, through the AdMob SDK, for the purpose of serving ads as described above.`,
  },
  {
    id: "your-rights",
    title: "Your Choices",
    content: `Since the app doesn't collect personal information directly, there's no account data to access or delete. For control over the advertising data Google collects via AdMob, use your device's ad settings (Android Settings → Google → Ads) or Google's own privacy controls at myaccount.google.com/data-and-privacy.`,
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: `If this policy changes (for example, if a future update adds new functionality that collects data), I'll update this page and change the "last updated" date above.`,
  },
  {
    id: "contact",
    title: "Contact",
    content: `Questions about this policy or the app can be sent to hello@nanayawdev.com. I'm based in Accra, Ghana.`,
  },
];

export default function CacHymnBookPrivacyPolicy() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 pt-40 lg:pt-52 pb-24">

        {/* Header */}
        <div className="mb-16 pb-12 border-b border-border">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Legal · CAC Hymn Book</p>
          <h1 className="font-display text-5xl lg:text-7xl font-semibold text-foreground leading-none tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-16">

          {/* Sticky nav */}
          <nav className="hidden lg:block">
            <ul className="sticky top-32 space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block text-sm py-1.5 px-3 rounded-lg transition-colors duration-200 ${
                      activeId === s.id
                        ? "text-foreground font-medium bg-foreground/5"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="max-w-2xl space-y-14">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-32">
                <h2 className="text-xl font-semibold text-foreground mb-4">{s.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-base">{s.content}</p>
              </section>
            ))}
            <div className="pt-6 border-t border-border">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back to home
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
