import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources - nanayawdev",
  description: "Articles and components on software engineering, system design, product engineering, web development, fintech, and AI — for teams building for African markets and beyond.",
  alternates: {
    canonical: "/resources",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
