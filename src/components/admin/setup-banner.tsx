import Link from "next/link";
import { BellRingingIcon as BellRinging, ArrowRightIcon as ArrowRight } from "@phosphor-icons/react";

interface SetupBannerProps {
  newEnquiries: number;
  unansweredQuestions: number;
}

export function SetupBanner({ newEnquiries, unansweredQuestions }: SetupBannerProps) {
  if (newEnquiries === 0 && unansweredQuestions === 0) return null;

  const parts = [
    newEnquiries > 0 && `${newEnquiries} new ${newEnquiries === 1 ? "enquiry" : "enquiries"}`,
    unansweredQuestions > 0 && `${unansweredQuestions} unanswered ${unansweredQuestions === 1 ? "question" : "questions"}`,
  ].filter(Boolean);

  const href = newEnquiries > 0 ? "/admin/enquiries" : "/admin/questions";

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-[#cdf68c]/10 px-6 py-5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#cdf68c] text-[#0a291a]">
          <BellRinging className="h-4 w-4" weight="fill" />
        </div>
        <p className="text-sm text-foreground">
          You have {parts.join(" and ")} waiting for a reply.
        </p>
      </div>
      <Link
        href={href}
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90"
      >
        Review now
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
