"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MapPinIcon as MapPin, ArrowUpRightIcon as ArrowUpRight } from "@phosphor-icons/react";

interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image: string | null;
  starts_at: string;
  venue: string | null;
  city: string;
  is_virtual: boolean;
  price_amount: string;
  price_currency: string;
}

function dateBadge(iso: string) {
  const d = new Date(iso);
  return {
    day: new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Accra", day: "2-digit" }).format(d),
    month: new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Accra", month: "short" }).format(d).toUpperCase(),
  };
}

function priceLabel(amount: string, currency: string) {
  const n = Number(amount);
  return n > 0 ? `${currency} ${n.toFixed(2)}` : "Free";
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => (r.ok ? r.json() : { events: [] }))
      .then((d) => setEvents(d.events ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 pt-40 lg:pt-52 pb-24">

        <motion.p
          className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          Events
        </motion.p>
        <motion.h1
          className="max-w-3xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground mb-6"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
        >
          Join Us
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-lg max-w-xl mb-20"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
        >
          Meetups, workshops, and launches — register on the web or dial in on USSD.
        </motion.p>

        {events.length === 0 && (
          <p className="text-muted-foreground text-base mb-16">No upcoming events right now. Check back soon.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => {
            const badge = dateBadge(event.starts_at);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.07 }}
              >
                <Link href={`/events/${event.slug}`} className="group flex flex-col h-full border border-border bg-background p-6 transition-colors hover:bg-muted/30">
                  <div className="mb-5 flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-muted">
                      <span className="text-lg font-bold leading-none text-foreground">{badge.day}</span>
                      <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground">{badge.month}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {event.is_virtual ? "Online" : event.venue || event.city}
                      </p>
                      <h2 className="text-lg font-bold leading-snug text-foreground">{event.title}</h2>
                    </div>
                  </div>

                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">{event.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{priceLabel(event.price_amount, event.price_currency)}</span>
                    <span className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors group-hover:text-foreground">
                      Details <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
