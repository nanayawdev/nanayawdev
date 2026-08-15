"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { QuestionModal } from "@/components/question-modal";

export function FaqCtaCard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="relative overflow-hidden border border-border bg-foreground p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold leading-snug text-background mb-3">
            Still have questions?
          </h3>
          <p className="text-sm leading-relaxed text-background/60">
            Drop me your question and I&apos;ll get back within 24 hours.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-[#FD4912] px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
          >
            I have more questions
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex h-10 w-10 items-center justify-center border border-background/20 text-background transition-colors hover:bg-background/10"
            aria-label="Ask a question"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <QuestionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
