"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarBlankIcon as CalendarBlank, MapPinIcon as MapPin, TicketIcon as Ticket, CheckIcon as Check } from "@phosphor-icons/react";
import { Spinner } from "@/components/admin/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TicketType {
  id: string;
  name: string;
  price: string;
  min_quantity: number;
}

interface EventDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image: string | null;
  starts_at: string;
  ends_at: string | null;
  venue: string | null;
  city: string;
  is_virtual: boolean;
  virtual_link: string | null;
  price_amount: string;
  price_currency: string;
  capacity: number | null;
  spots_left: number | null;
  ticket_types: TicketType[];
}

type Form = { name: string; phone: string; email: string; ticketTypeId: string; quantity: number };
const empty: Form = { name: "", phone: "", email: "", ticketTypeId: "", quantity: 1 };

const inputClass =
  "w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30 transition-colors";

function fullDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Accra", weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit",
  }).format(new Date(iso));
}

function priceLabel(amount: string, currency: string) {
  const n = Number(amount);
  return n > 0 ? `${currency} ${n.toFixed(2)}` : "Free";
}

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setEvent(d.event);
        if (d.event.ticket_types?.[0]) {
          setForm((f) => ({ ...f, ticketTypeId: d.event.ticket_types[0].id, quantity: d.event.ticket_types[0].min_quantity }));
        }
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const selectedTicketType = event?.ticket_types.find((t) => t.id === form.ticketTypeId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim()) { setError("Name and phone are required"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, phone: form.phone, email: form.email,
          ticket_type_id: form.ticketTypeId || undefined, quantity: form.quantity,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); setLoading(false); return; }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Event not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 pt-40 lg:pt-48 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left — event info */}
          <div className="flex flex-col">
            <motion.p
              className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-5"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            >
              Event
            </motion.p>

            {!event ? (
              <Spinner size="sm" />
            ) : (
              <>
                <motion.h1
                  className="font-display text-4xl lg:text-6xl font-semibold text-foreground leading-none tracking-tight mb-8"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
                >
                  {event.title}
                </motion.h1>

                <div className="space-y-3 mb-8">
                  <p className="flex items-center gap-2.5 text-sm text-foreground">
                    <CalendarBlank className="h-4 w-4 text-muted-foreground shrink-0" /> {fullDateTime(event.starts_at)}
                  </p>
                  <p className="flex items-center gap-2.5 text-sm text-foreground">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    {event.is_virtual ? "Online — link sent after registration" : [event.venue, event.city].filter(Boolean).join(", ") || "Venue TBA"}
                  </p>
                  <p className="flex items-center gap-2.5 text-sm text-foreground">
                    <Ticket className="h-4 w-4 text-muted-foreground shrink-0" /> {priceLabel(event.price_amount, event.price_currency)}
                    {event.spots_left !== null && <span className="text-muted-foreground">· {event.spots_left} spots left</span>}
                  </p>
                </div>

                <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-10 whitespace-pre-wrap">
                  {event.description}
                </p>

                <p className="text-xs text-muted-foreground/70 uppercase tracking-widest">
                  Prefer USSD? Dial the code on your ad or flyer and follow the prompts to register.
                </p>
              </>
            )}
          </div>

          {/* Right — registration form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center border border-border rounded-2xl p-12 h-full">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#cdf68c]">
                  <Check className="h-6 w-6 text-[#0a291a]" weight="bold" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">You&apos;re registered!</h2>
                <p className="text-muted-foreground text-sm max-w-xs">
                  We&apos;ve sent the details to your phone. See you there.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-border rounded-2xl p-8 space-y-5">
                <h2 className="text-xl font-bold text-foreground mb-1">Register</h2>
                <p className="text-sm text-muted-foreground mb-4">Fill this in and we&apos;ll confirm your spot by SMS.</p>

                {event && event.ticket_types.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Ticket Type</label>
                    <Select
                      value={form.ticketTypeId}
                      onValueChange={(value) => {
                        const t = event.ticket_types.find((tt) => tt.id === value);
                        setForm((f) => ({ ...f, ticketTypeId: value, quantity: t?.min_quantity ?? 1 }));
                      }}
                    >
                      <SelectTrigger className="w-full rounded-xl border border-border bg-transparent px-4 py-3 h-auto text-sm focus:outline-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {event.ticket_types.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name} — {priceLabel(t.price, event.price_currency)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedTicketType && selectedTicketType.min_quantity > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Number of Tickets (min {selectedTicketType.min_quantity})</label>
                    <input
                      type="number" min={selectedTicketType.min_quantity} value={form.quantity}
                      onChange={(e) => setForm((f) => ({ ...f, quantity: Math.max(Number(e.target.value) || 1, selectedTicketType.min_quantity) }))}
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input value={form.name} onChange={set("name")} placeholder="Ama Serwaa" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <input value={form.phone} onChange={set("phone")} placeholder="0244000000" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email (optional)</label>
                  <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className={inputClass} />
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !event}
                  className="w-full rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? <Spinner size="sm" className="text-background" /> : "Register"}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
