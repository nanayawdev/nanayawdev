"use client";

import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  initials: string;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  website: string | null;
}

const PREVIEW_W = 320;
const PREVIEW_H = 220;

function MemberCard({
  member,
  index,
  onMouseEnter,
  onMouseLeave,
}: {
  member: TeamMember;
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
              {member.github && (
                <a href={member.github} target="_blank" rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  aria-label={`${member.name}'s GitHub`}>
                  <Github className="h-4 w-4" />
                </a>
              )}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  aria-label={`${member.name}'s LinkedIn`}>
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {member.twitter && (
                <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  aria-label={`${member.name}'s Twitter`}>
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {member.website && (
                <a href={member.website} target="_blank" rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  aria-label={`${member.name}'s Website`}>
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

export function TeamSection() {
  const [members, setMembers]             = useState<TeamMember[]>([]);
  const [hoveredMember, setHoveredMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.ok ? r.json() : { members: [] })
      .then((d) => setMembers(d.members ?? []));
  }, []);

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

  if (members.length === 0) return null;

  return (
    <section className="border-t border-border" onMouseMove={handleMouseMove}>

      {/* Floating photo preview */}
      <AnimatePresence>
        {hoveredMember?.photo && (
          <motion.div
            className="fixed top-0 left-0 z-50 pointer-events-none overflow-hidden"
            style={{ width: PREVIEW_W, height: PREVIEW_H, x: springX, y: springY }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
          >
            <Image src={hoveredMember.photo} alt={hoveredMember.name} fill className="object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

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
            {members.map((member, index) => (
              <MemberCard
                key={member.id}
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
  );
}
