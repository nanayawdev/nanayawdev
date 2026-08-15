import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - nanayawdev",
  description: "Software engineer, designer, and strategist rolled into one. Learn about how I work and what I believe in.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
