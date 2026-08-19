import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apps - nanayawdev",
  description: "Apps built and published by nanayawdev, live on the Play Store and App Store.",
  alternates: {
    canonical: "/apps",
  },
};

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
