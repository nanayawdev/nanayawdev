import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CTACard } from "@/components/cta-card";

const caseStudies: Record<string, {
  client: string;
  category: string;
  year: string;
  url: string;
  image: string;
  tagline: string;
  services: string[];
  stats: { label: string; value: string }[];
  problem: string;
  approach: string;
  result: string;
  resultHeadline: string;
  resultBody: string;
}> = {
  "thomisia-travel": {
    client: "Thomisia Travel",
    category: "Web Development",
    year: "2024",
    url: "https://thomisiatravelandtour.com",
    image: "/hero1.avif",
    tagline: "Bringing African travel booking into the digital age.",
    services: ["UX/UI Design", "Web Development", "SEO"],
    stats: [
      { label: "Increase in bookings", value: "3×" },
      { label: "Time to launch", value: "6 weeks" },
      { label: "Bounce rate reduction", value: "42%" },
    ],
    problem: "Thomisia Travel was processing bookings entirely over WhatsApp and phone calls. They had no way to capture leads outside business hours, no visibility into conversion rates, and their competitors were pulling ahead with modern booking experiences.",
    approach: "We started with a deep discovery session to understand their most common booking flows, then designed a streamlined web experience around those journeys. We built a custom availability and inquiry system integrated with their existing workflow — no off-the-shelf booking engine that would force them to change how they operate.",
    result: "Within three months of launch, online bookings tripled. The team stopped spending hours on manual WhatsApp coordination and could focus on client experience.",
    resultHeadline: "Thomisia Travel triples online bookings in three months.",
    resultBody: "The site now handles enquiries 24/7 and consistently ranks on the first page for their key search terms. The team reclaimed hours previously lost to manual coordination.",
  },
  "urban-drive": {
    client: "Urban Drive",
    category: "Mobile App",
    year: "2024",
    url: "https://urbandriveapp.vercel.app",
    image: "/hero2.avif",
    tagline: "A ride-hailing experience built for African cities.",
    services: ["iOS Development", "Android Development", "UI/UX Design"],
    stats: [
      { label: "Rides in first 60 days", value: "10K" },
      { label: "App store rating", value: "4.7★" },
      { label: "Driver onboarding time", value: "< 10 min" },
    ],
    problem: "Urban Drive needed a ride-hailing app that worked reliably in cities with inconsistent data coverage and cash-dominant payment cultures — problems that apps built for Western markets had never solved well.",
    approach: "We built the app with offline-first architecture so core features work even with poor connectivity. We integrated mobile money alongside card payments and kept the driver onboarding flow under ten minutes — a critical metric for driver supply growth.",
    result: "10,000 rides were completed in the first 60 days. Driver retention outperformed projections because the app was genuinely easier to use than the alternatives.",
    resultHeadline: "Urban Drive completes 10,000 rides in the first 60 days.",
    resultBody: "The 4.7 App Store rating reflects how much passengers appreciated a product designed for their reality. Driver onboarding time stayed under ten minutes, fuelling rapid supply growth.",
  },
  "evvents-africa": {
    client: "Evvents Africa",
    category: "Web Platform",
    year: "2023",
    url: "https://evventsafrica.vercel.app",
    image: "/hero3.avif",
    tagline: "Making African events easier to run and easier to find.",
    services: ["Web Design", "Web Development", "Payment Integration"],
    stats: [
      { label: "Events managed at launch", value: "50+" },
      { label: "Ticket sales in month one", value: "5,000+" },
      { label: "Organiser onboarding time", value: "15 min" },
    ],
    problem: "Event organisers across West Africa were piecing together spreadsheets, bank transfers, and social media DMs to manage ticket sales. There was no platform that understood local payment methods or the informal way many African events are promoted.",
    approach: "We built a clean, opinionated event management platform — organisers can create an event, set ticket tiers, and start selling in under 15 minutes. We integrated mobile money, card payments, and a QR code check-in system that works offline.",
    result: "Over 50 events were published in the first month of launch. More than 5,000 tickets were sold through the platform in that same period.",
    resultHeadline: "Evvents Africa sells 5,000+ tickets in its first month.",
    resultBody: "Organisers reported saving hours per event on administrative work. The offline QR check-in system was highlighted as a standout feature at every major event.",
  },
  "urban-tickets": {
    client: "Urban Tickets",
    category: "Mobile App",
    year: "2023",
    url: "https://urbantickets.app",
    image: "/hero6.webp",
    tagline: "Your ticket to every live experience in the city.",
    services: ["iOS Development", "Android Development", "Brand Identity"],
    stats: [
      { label: "Tickets sold in 90 days", value: "20K" },
      { label: "Events listed at launch", value: "120+" },
      { label: "Average checkout time", value: "45 sec" },
    ],
    problem: "Urban Tickets needed a mobile-first ticketing app that could compete with established players while serving markets where most users transact exclusively on mobile and prefer to pay with mobile money.",
    approach: "We designed a purchase flow optimised for speed — the average checkout takes 45 seconds from search to confirmation. We built smart event discovery using location and preference signals, and the check-in system uses QR codes that work completely offline.",
    result: "20,000 tickets were sold across 120+ events in the first 90 days.",
    resultHeadline: "Urban Tickets sells 20,000 tickets across 120+ events in 90 days.",
    resultBody: "The offline QR check-in system eliminated entry queues at several major events, driving word-of-mouth that money couldn't buy. Average checkout time held steady at 45 seconds.",
  },
  "healthier-bt": {
    client: "Healthier BT",
    category: "Web & Brand",
    year: "2023",
    url: "https://healthierbtsolutions.com",
    image: "/hero7.webp",
    tagline: "A wellness brand built to be trusted.",
    services: ["Brand Identity", "Web Design", "Web Development"],
    stats: [
      { label: "Rise in consultation bookings", value: "40%" },
      { label: "Time to complete rebrand", value: "4 weeks" },
      { label: "Organic search growth", value: "2×" },
    ],
    problem: "Healthier BT had strong clinical expertise but a brand and website that didn't reflect it. Potential clients were landing on their site and leaving — the design was outdated, the messaging was generic, and there was no easy way to book a consultation online.",
    approach: "We started with the brand — new visual identity, refined messaging, and a clear point of view. Then we rebuilt the website around a single goal: getting qualified visitors to book a consultation. Every page, every piece of copy was written with that conversion in mind.",
    result: "Consultation bookings increased 40% in the first quarter after launch.",
    resultHeadline: "Healthier BT grows consultation bookings by 40% in one quarter.",
    resultBody: "Organic search traffic doubled within six months as the new site structure made it far easier for Google to understand and rank their content. The rebrand completed in just four weeks.",
  },
};

const caseStudySlugs = [
  "thomisia-travel",
  "urban-drive",
  "evvents-africa",
  "urban-tickets",
  "healthier-bt",
];

export default function CaseStudyDetail({ params }: { params: { slug: string } }) {
  const study = caseStudies[params.slug];
  if (!study) notFound();

  const related = caseStudySlugs
    .filter((s) => s !== params.slug)
    .slice(0, 2)
    .map((s) => ({ slug: s, ...caseStudies[s] }));

  return (
    <div className="min-h-screen bg-background">

      {/* Back */}
      <div className="max-w-7xl mx-auto px-8 pt-32 lg:pt-36 mb-12">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Case Studies
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
              {study.category} · {study.year}
            </p>
            <h1 className="text-5xl lg:text-8xl font-bold text-foreground leading-none tracking-tight mb-4">
              {study.client}
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl">{study.tagline}</p>
          </div>
          <a
            href={study.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 shrink-0"
          >
            Visit Site <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Full-width hero image */}
      <div className="relative w-full aspect-[16/7] overflow-hidden mb-16">
        <Image src={study.image} alt={study.client} fill className="object-cover" />
      </div>

      {/* Stats */}
      <div className="border-y border-border">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-3 divide-x divide-border">
            {study.stats.map((stat) => (
              <div key={stat.label} className="px-8 first:pl-0 last:pr-0 text-center">
                <p className="text-4xl lg:text-6xl font-bold text-foreground mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-7xl mx-auto px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24">

          {/* Services sidebar + CTA card */}
          <div className="lg:sticky lg:top-32 h-fit space-y-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Services</p>
              <ul className="space-y-2">
                {study.services.map((s) => (
                  <li key={s} className="text-base text-foreground font-medium">{s}</li>
                ))}
              </ul>
            </div>

            <CTACard />
          </div>

          {/* Narrative */}
          <div className="space-y-14">
            {[
              { label: "The Problem", body: study.problem },
              { label: "Our Approach", body: study.approach },
            ].map(({ label, body }) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{label}</p>
                <p className="text-foreground text-lg leading-relaxed">{body}</p>
              </div>
            ))}

            {/* Results */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Results</p>
              <h3 className="text-2xl font-bold leading-snug text-foreground mb-4">
                {study.resultHeadline}
              </h3>
              <p className="text-foreground text-lg leading-relaxed mb-8">{study.result}</p>
              <p className="text-sm text-muted-foreground mb-6">The results are clear:</p>
              <div className="grid grid-cols-3 divide-x divide-border border border-border mb-8">
                {study.stats.map((stat) => (
                  <div key={stat.label} className="bg-muted/40 px-5 py-6">
                    <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                    <p className="text-xs leading-snug text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-foreground text-lg leading-relaxed">{study.resultBody}</p>
            </div>
          </div>
        </div>
      </div>

      {/* More case studies */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-8 py-16 lg:py-20">

          {/* Header row */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              More case studies
            </h2>
            <Link
              href="/case-studies"
              className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
            >
              View All
            </Link>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/case-studies/${r.slug}`}
                className="group flex overflow-hidden border border-border bg-muted/30 transition-colors hover:bg-muted/50"
              >
                {/* Image */}
                <div className="relative w-2/5 shrink-0 overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.client}
                    fill
                    sizes="(max-width: 768px) 40vw, 20vw"
                    className="object-cover grayscale transition duration-500 group-hover:grayscale-0"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between p-6">
                  <div>
                    <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {r.client}
                    </p>
                    <p className="text-base font-semibold leading-snug text-foreground">
                      {r.resultHeadline}
                    </p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                    Read More
                    <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
