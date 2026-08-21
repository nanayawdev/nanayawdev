import Link from "next/link";
import {
  FileTextIcon as FileText,
  BriefcaseIcon as Briefcase,
  ChatCircleTextIcon as ChatCircleText,
  EnvelopeSimpleIcon as Mail,
  ChatTextIcon as MessageSquare,
  SealQuestionIcon as HelpCircle,
} from "@phosphor-icons/react";

const actions = [
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "Projects", href: "/admin/projects", icon: Briefcase },
  { label: "Testimonials", href: "/admin/testimonials", icon: ChatCircleText },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Live Chat", href: "/admin/chat", icon: MessageSquare },
  { label: "FAQ Questions", href: "/admin/questions", icon: HelpCircle },
];

export function QuickActions() {
  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">Quick actions</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {actions.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-2.5 rounded-xl border border-border px-4 py-6 text-center transition-colors hover:bg-muted/40"
          >
            <Icon className="h-5 w-5 text-foreground" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
