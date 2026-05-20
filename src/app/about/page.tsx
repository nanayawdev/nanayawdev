"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, Twitter, Globe } from "lucide-react";

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
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    }
  },
  {
    name: "Akosua Frimpong",
    role: "Digital Marketer",
    initials: "AF",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    }
  },
];

function TeamMemberCard({ member, index }: { member: typeof team[0]; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className="relative group rounded-3xl border border-border bg-card/10 backdrop-blur-sm p-6 overflow-hidden transition-all duration-500 hover:border-foreground/10 hover:shadow-2xl hover:shadow-black/5"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      {/* Background Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              rgba(253, 73, 18, 0.07),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Profile Image Container */}
      <div className="aspect-square rounded-2xl bg-muted/30 overflow-hidden mb-6 relative border border-border/50">
        <Image
          src="/hero7.webp"
          alt={member.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Subtle dark overlay for visual coherence on hover */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Info Block */}
      <div className="space-y-1 relative z-10">
        <h4 className="text-lg font-bold text-foreground tracking-tight transition-colors duration-300">
          {member.name}
        </h4>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {member.role}
        </p>
      </div>

      {/* Social Links Row */}
      <div className="mt-5 pt-4 border-t border-border/40 flex items-center gap-4 relative z-20">
        {"github" in member.socials && member.socials.github && (
          <a
            href={member.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
            aria-label={`${member.name}'s GitHub`}
          >
            <Github className="w-4.5 h-4.5" />
          </a>
        )}
        {"linkedin" in member.socials && member.socials.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
            aria-label={`${member.name}'s LinkedIn`}
          >
            <Linkedin className="w-4.5 h-4.5" />
          </a>
        )}
        {"twitter" in member.socials && member.socials.twitter && (
          <a
            href={member.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
            aria-label={`${member.name}'s Twitter`}
          >
            <Twitter className="w-4.5 h-4.5" />
          </a>
        )}
        {"globe" in member.socials && member.socials.globe && (
          <a
            href={member.socials.globe}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/60 hover:text-foreground transition-colors duration-300"
            aria-label={`${member.name}'s Website`}
          >
            <Globe className="w-4.5 h-4.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
