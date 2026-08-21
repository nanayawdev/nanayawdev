import Link from "next/link";

export interface DashboardEnquiry {
  id: string;
  name: string;
  company: string;
  budget: string;
  status: string;
  created_at: string;
}

const STATUS_STYLE: Record<string, string> = {
  new: "border-[#cdf68c] text-[#5a7a2e]",
  read: "border-border text-muted-foreground",
  replied: "border-green-500 text-green-600",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function EnquiryListCard({ enquiry }: { enquiry: DashboardEnquiry }) {
  return (
    <Link
      href="/admin/enquiries"
      className="flex items-center gap-4 rounded-lg border border-border bg-background px-5 py-4 transition-colors hover:bg-muted/30"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
        {enquiry.name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{enquiry.name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {[enquiry.company, enquiry.budget].filter(Boolean).join(" · ") || "No details provided"}
        </p>
      </div>
      <span className="shrink-0 text-[0.6rem] text-muted-foreground">{timeAgo(enquiry.created_at)}</span>
      <span
        className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] ${
          STATUS_STYLE[enquiry.status] ?? STATUS_STYLE.read
        }`}
      >
        {enquiry.status}
      </span>
    </Link>
  );
}
