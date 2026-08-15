"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import TextLoop from "@/components/TextLoop";

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  avatar: string | null;
}

const CARD_W = 340;

function offsetStyle(offset: number) {
  const abs = Math.abs(offset);
  return {
    x: offset * 250,
    rotate: offset * 7,
    scale: 1 - abs * 0.08,
    opacity: abs > 2 ? 0 : 1 - abs * 0.22,
    zIndex: 50 - abs,
  };
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => (r.ok ? r.json() : { testimonials: [] }))
      .then((d) => setTestimonials(d.testimonials ?? []));
  }, []);

  const len = testimonials.length;
  function prev() { setActive((i) => (i - 1 + len) % len); }
  function next() { setActive((i) => (i + 1) % len); }

  if (len === 0) return null;

  const seen = new Set<number>();
  const visible = [0, -1, 1, -2, 2].reduce<{ offset: number; testimonial: Testimonial }[]>((acc, offset) => {
    const index = (active + offset + len * 100) % len;
    if (seen.has(index)) return acc;
    seen.add(index);
    acc.push({ offset, testimonial: testimonials[index] });
    return acc;
  }, []);

  return (
    <section className="relative overflow-hidden bg-foreground py-20 lg:py-28">
      <motion.div
        className="relative z-10 w-full overflow-hidden"
        style={{ height: 340 }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <TextLoop
            text="Don't take our word for it"
            shape="wave"
            speed={45}
            direction="forward"
            separator="•"
            curviness={24}
            fontSize={64}
            fontWeight={600}
            letterSpacing={-1}
            uppercase={false}
            color="#ffffff"
            ribbon
            ribbonColor="#542e7b"
            ribbonWidth={110}
            pauseOnHover
            style={{ fontFamily: "var(--font-display)" }}
          />
        </div>
      </motion.div>

      <div
        className="relative mx-auto mt-16 flex justify-center"
        style={{ height: 420 }}
      >
        {visible.map(({ offset, testimonial }) => {
          const isActive = offset === 0;
          const s = offsetStyle(offset);
          return (
            <motion.div
              key={testimonial.id}
              className={`absolute top-0 flex flex-col justify-between overflow-hidden rounded-2xl p-8 text-left shadow-xl ${
                isActive ? "bg-background text-foreground" : "bg-background/10 text-background/70 backdrop-blur-sm"
              }`}
              style={{ width: CARD_W, minHeight: 360, zIndex: s.zIndex }}
              animate={{ x: s.x, rotate: s.rotate, scale: s.scale, opacity: s.opacity }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <p className={`text-base leading-relaxed ${isActive ? "text-foreground/85" : "text-background/70"}`}>
                {testimonial.quote}
              </p>
              <div className="mt-6 flex items-center gap-3">
                {testimonial.avatar ? (
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
                    <Image src={testimonial.avatar} alt={testimonial.author_name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isActive ? "bg-muted" : "bg-background/15"}`}>
                    <User className={`h-4 w-4 ${isActive ? "text-muted-foreground" : "text-background/60"}`} />
                  </div>
                )}
                <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-background/80"}`}>
                  {testimonial.author_name}
                  {testimonial.author_role && <>, {testimonial.author_role}</>}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {len > 1 && (
        <div className="relative z-10 mt-10 flex items-center justify-center gap-3">
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center bg-[#542e7b] text-white transition-opacity hover:opacity-90"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center bg-[#542e7b] text-white transition-opacity hover:opacity-90"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
