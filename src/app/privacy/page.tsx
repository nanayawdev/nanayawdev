"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `Devs & Creatives ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect when you visit our website or engage our services, how we use it, and your rights regarding it. By using our site or services, you agree to the practices described here.`,
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: `We collect information you give us directly — such as your name, email address, company name, and project details when you submit our contact or project brief form. We also collect information automatically when you visit our site, including your IP address, browser type, pages visited, and time spent. This is collected via cookies and standard server logs.`,
  },
  {
    id: "how-we-use-it",
    title: "How We Use It",
    content: `We use your information to respond to enquiries, prepare project proposals, deliver our services, and send relevant updates about your project. We do not use your data for advertising purposes or sell it to third parties. We may occasionally send you information about our work if you have opted in, and you can unsubscribe at any time.`,
  },
  {
    id: "data-sharing",
    title: "Data Sharing",
    content: `We do not sell, rent, or trade your personal information. We may share data with trusted service providers who assist in running our business — such as cloud hosting, email delivery, and analytics — under strict confidentiality agreements. We may also disclose information when required by law or to protect our legal rights.`,
  },
  {
    id: "data-security",
    title: "Data Security",
    content: `We take reasonable technical and organisational measures to protect your data against unauthorised access, alteration, or disclosure. Our website uses HTTPS encryption. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: `You have the right to access, correct, or delete the personal information we hold about you. You may also object to or restrict certain types of processing. To exercise any of these rights, contact us at hello@devsandcreatives.com. We will respond within 30 days.`,
  },
  {
    id: "cookies",
    title: "Cookies",
    content: `Our website uses cookies to understand how visitors interact with our content. These are small text files stored on your device. We use strictly necessary cookies (required for the site to function) and analytics cookies (to understand traffic patterns). You can disable cookies in your browser settings, though this may affect site functionality.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy or how we handle your data, please contact us at hello@devsandcreatives.com. We are based in Accra, Ghana, and are happy to address any concerns you may have.`,
  },
];

export default function PrivacyPolicy() {
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
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Legal</p>
          <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-none tracking-tight mb-4">
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
