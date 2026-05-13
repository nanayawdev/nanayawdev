import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Github, Instagram } from "lucide-react";

const company = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
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
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/devsandcreatives" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/devsandcreatives" },
  { icon: Github, label: "GitHub", href: "https://github.com/devsandcreatives" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/devsandcreatives" },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-8 pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 mb-16">

          {/* Col 1 — Brand */}
          <div>
            <Link href="/" className="inline-block mb-5">
              <div className="w-14 h-14 rounded-xl overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Devs & Creatives"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              A digital agency helping African startups and brands go global through design, development, and storytelling.
            </p>
            <div className="flex items-center gap-4">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Company
            </p>
            <ul className="space-y-3">
              {company.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Services */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Services
            </p>
            <ul className="space-y-3">
              {services.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Start a project */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Start a Project
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Have something in mind? We&apos;d love to hear about it.
            </p>
            <a
              href="mailto:hello@devsandcreatives.com"
              className="text-sm font-medium text-foreground hover:text-muted-foreground transition-colors break-all"
            >
              hello@devsandcreatives.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Devs &amp; Creatives. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
