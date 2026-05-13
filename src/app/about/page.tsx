"use client";

import { motion } from "framer-motion";
import type { Metadata } from "next";

const values = [
  {
    title: "African-First, Globally Minded",
    description: "We build from a deep understanding of African markets while holding ourselves to the highest international standards. Local insight, global ambition.",
  },
  {
    title: "Craft Over Shortcuts",
    description: "We don't use templates. Every pixel, every line of code, every word is deliberate. We'd rather take the extra day to get it right than ship something we're not proud of.",
  },
  {
    title: "Partnerships, Not Transactions",
    description: "We measure success by whether your business grows — not by whether we delivered files. Our best clients have been with us for years, not weeks.",
  },
  {
    title: "Radical Transparency",
    description: "Honest timelines, honest pricing, honest feedback. If something isn't working, we'll tell you before you have to ask.",
  },
];

const team = [
  { name: "Kwame Asante", role: "Founder & Creative Director", initials: "KA" },
  { name: "Ama Owusu", role: "Lead Engineer", initials: "AO" },
  { name: "Kofi Mensah", role: "UI/UX Designer", initials: "KM" },
  { name: "Abena Darko", role: "Brand Strategist", initials: "AD" },
  { name: "Yaw Boateng", role: "Mobile Developer", initials: "YB" },
  { name: "Akosua Frimpong", role: "Digital Marketer", initials: "AF" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="pt-40 pb-24 lg:pt-52 lg:pb-32 max-w-7xl mx-auto px-8">
        <motion.p
          className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Us
        </motion.p>
        <motion.h1
          className="text-5xl lg:text-8xl font-bold text-foreground leading-none tracking-tight max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          We&apos;re developers and creatives who give a damn.
        </motion.h1>
      </section>

      {/* Manifesto + Values */}
      <section className="py-16 lg:py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">

            {/* Left — manifesto */}
            <div className="lg:sticky lg:top-32">
              <motion.p
                className="text-muted-foreground text-lg leading-relaxed mb-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Devs & Creatives was built on one belief: African brands deserve world-class digital experiences, built by people who understand the market from the inside.
              </motion.p>
              <motion.p
                className="text-muted-foreground text-lg leading-relaxed"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                We&apos;re a small team of designers, engineers, and strategists. We move fast, communicate clearly, and we&apos;re obsessive about quality. Our clients don&apos;t come back because we&apos;re cheap — they come back because we make them look good and their products actually work.
              </motion.p>
            </div>

            {/* Right — values */}
            <div className="divide-y divide-border">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="py-8"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-6">
                    <span className="text-xs font-medium text-muted-foreground/40 tabular-nums pt-1.5 w-6 shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-muted-foreground text-base leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-8">
          <motion.p
            className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            The Team
          </motion.p>
          <motion.h2
            className="text-4xl lg:text-6xl font-bold text-foreground leading-none tracking-tight mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            viewport={{ once: true }}
          >
            The people behind the work
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                viewport={{ once: true }}
              >
                <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center mb-4 group-hover:bg-foreground/10 transition-colors duration-300">
                  <span className="text-2xl font-bold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {member.initials}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
