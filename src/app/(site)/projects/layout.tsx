import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - nanayawdev",
  description: "Explore my portfolio of successful projects helping startups and brands go global. See my web development, design, and digital solutions.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
