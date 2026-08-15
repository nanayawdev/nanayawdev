"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `These Terms of Service ("Terms") govern your engagement with nanayawdev for any digital services including web design, web development, mobile app development, brand identity, and digital marketing. By engaging my services, you agree to be bound by these Terms. If you do not agree, please do not proceed with an engagement.`,
  },
  {
    id: "services",
    title: "Services",
    content: `nanayawdev provides creative and technical digital services as agreed in individual project proposals or service agreements. The scope, deliverables, timeline, and cost of each engagement are defined in a written proposal or statement of work (SOW) issued before work begins. Any work outside the agreed scope will be quoted separately.`,
  },
  {
    id: "project-engagements",
    title: "Project Engagements",
    content: `All projects begin with a signed proposal or SOW and an upfront deposit (typically 50% of the total project cost). Work will not commence until the deposit is received. You are responsible for providing accurate briefs, timely feedback, and any assets required for the project. Delays caused by late client feedback may affect the delivery timeline.`,
  },
  {
    id: "payment-terms",
    title: "Payment Terms",
    content: `Payments are due as outlined in your project proposal. Invoices not paid within 14 days of the due date may incur a 2% monthly late fee. I reserve the right to pause or suspend work on overdue accounts. Final deliverables, source files, and live deployment will only be released upon receipt of full payment.`,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: `Upon receipt of full payment, all final deliverables created specifically for your project become your property. I retain ownership of all preliminary concepts, drafts, and unused designs. I reserve the right to display completed work in my portfolio and marketing materials unless otherwise agreed in writing. I retain ownership of any proprietary tools, frameworks, or processes used during the project.`,
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    content: `Both parties agree to keep confidential any sensitive business information shared during the engagement. I will not disclose your proprietary information to third parties without your consent. Similarly, my internal processes, pricing structures, and vendor relationships are confidential. This obligation survives the termination of the engagement.`,
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: `nanayawdev shall not be liable for any indirect, incidental, or consequential damages arising from the use of my services or deliverables. My total liability for any claim shall not exceed the total fees paid for the specific project giving rise to the claim. I am not responsible for losses due to circumstances beyond my control, including third-party platform changes, hosting failures, or acts of nature.`,
  },
  {
    id: "termination",
    title: "Termination",
    content: `Either party may terminate a project engagement with 14 days written notice. In the event of termination, you are responsible for paying for all work completed up to the termination date. Any deposit paid is non-refundable. If I terminate due to non-payment or breach of these Terms, I reserve the right to remove any work from live environments until outstanding balances are settled.`,
  },
  {
    id: "contact",
    title: "Contact",
    content: `For any questions about these Terms or to discuss a specific engagement, please reach out at hello@nanayawdev.com. I am based in Accra, Ghana, and aim to respond to all enquiries within 1–2 business days.`,
  },
];

export default function TermsOfService() {
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
          <h1 className="font-display text-5xl lg:text-7xl font-semibold text-foreground leading-none tracking-tight mb-4">
            Terms of Service
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
