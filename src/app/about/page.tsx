"use client";

import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Image from "next/image";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";
import { CTACard } from "@/components/cta-card";

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
  {
    name: "Kwame Asante",
    role: "Founder & Creative Director",
    initials: "KA",
    image: "/hero1.avif",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    }
  },
  {
    name: "Ama Owusu",
    role: "Lead Engineer",
    initials: "AO",
    image: "/hero2.avif",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    }
  },
  {
    name: "Kofi Mensah",
    role: "UI/UX Designer",
    initials: "KM",
    image: "/hero3.avif",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      globe: "https://dribbble.com",
    }
  },
  {
    name: "Abena Darko",
    role: "Brand Strategist",
    initials: "AD",
    image: "/hero6.webp",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      globe: "https://medium.com",
    }
  },
  {
    name: "Yaw Boateng",
    role: "Mobile Developer",
    initials: "YB",
    image: "/hero7.webp",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    }
  },
  {
    name: "Akosua Frimpong",
    role: "Digital Marketer",
    initials: "AF",
    image: "/hero8.jpg",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    }
  },
];

const PREVIEW_W = 320;
const PREVIEW_H = 220;

function TeamMemberCard({
  member,
  index,
  onMouseEnter,
  onMouseLeave,
}: {
  member: typeof team[0];
  index: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <motion.div
      className="group relative min-h-[320px] overflow-hidden border border-border bg-background p-6 transition-colors duration-300 hover:bg-muted/30"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <span className="absolute right-5 top-5 text-[0.65rem] text-muted-foreground/50 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="pointer-events-none absolute inset-x-0 top-8 text-center text-[clamp(7rem,18vw,12rem)] font-semibold leading-none tracking-[-0.12em] text-muted-foreground/[0.08] transition-colors duration-300 group-hover:text-muted-foreground/[0.14]">
        {member.initials}
      </div>

      <div className="relative z-10 flex h-full min-h-[272px] flex-col justify-between">
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Team Member
          </p>
        </div>

        <div>
          <h4 className="max-w-[12rem] text-3xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground">
            {member.name}
          </h4>
          <div className="mt-5 flex items-end justify-between gap-6 border-t border-border pt-5">
            <p className="max-w-[11rem] text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {member.role}
            </p>
            <div className="flex shrink-0 items-center gap-3">
              {"github" in member.socials && member.socials.github && (
                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  aria-label={`${member.name}'s GitHub`}
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {"linkedin" in member.socials && member.socials.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  aria-label={`${member.name}'s LinkedIn`}
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {"twitter" in member.socials && member.socials.twitter && (
                <a
                  href={member.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  aria-label={`${member.name}'s Twitter`}
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {"globe" in member.socials && member.socials.globe && (
                <a
                  href={member.socials.globe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  aria-label={`${member.name}'s Website`}
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function About() {
  const [hoveredMember, setHoveredMember] = useState<typeof team[0] | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.5 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX + 24);
      mouseY.set(e.clientY - PREVIEW_H / 2);
    },
    [mouseX, mouseY]
  );

  return (
    <div className="min-h-screen bg-background" onMouseMove={handleMouseMove}>

      {/* Floating team member image preview */}
      <AnimatePresence>
        {hoveredMember && (
          <motion.div
            className="fixed top-0 left-0 z-50 pointer-events-none overflow-hidden"
            style={{
              width: PREVIEW_W,
              height: PREVIEW_H,
              x: springX,
              y: springY,
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={hoveredMember.image}
              alt={hoveredMember.name}
              fill
              className="object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

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
          className="max-w-5xl overflow-visible text-[clamp(4rem,10vw,9rem)] font-bold leading-[0.85] tracking-[-0.07em] text-foreground"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          We Design. We Build. We Make it Matter.
        </motion.h1>
      </section>

      {/* Manifesto + Values */}
      <section className="border-t border-border">
        {/* Full-width Image */}
        <motion.div
          className="w-full relative h-[350px] sm:h-[500px] lg:h-[650px] overflow-hidden bg-muted"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Image
            src="/hero6.webp"
            alt="Devs & Creatives Creative Studio"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
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
              <div className="mt-10">
                <CTACard />
              </div>
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
      <section className="border-t border-border">
        <div className="border-b border-border px-8 py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <motion.p
              className="text-sm font-medium uppercase tracking-widest text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              The Team
            </motion.p>
            <motion.p
              className="max-w-xl text-base leading-relaxed text-muted-foreground lg:justify-self-end"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              viewport={{ once: true }}
            >
              A small team of strategists, designers, and engineers building sharp digital products with care, clarity, and taste.
            </motion.p>
          </div>
        </div>

        <div className="px-8 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <motion.h2
              className="mb-12 max-w-5xl text-[clamp(3.5rem,11vw,10rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground lg:mb-16"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              viewport={{ once: true }}
            >
              The people behind the work
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {team.map((member, index) => (
                <TeamMemberCard
                  key={member.name}
                  member={member}
                  index={index}
                  onMouseEnter={() => setHoveredMember(member)}
                  onMouseLeave={() => setHoveredMember(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
