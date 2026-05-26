import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Arssent",
  description: "Explore our portfolio of successful projects helping African startups and brands go global. See our web development, design, and digital solutions.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
