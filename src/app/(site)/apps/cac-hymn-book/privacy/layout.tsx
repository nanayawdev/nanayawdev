import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CAC Hymn Book Privacy Policy - nanayawdev",
  description: "Privacy policy for the CAC Hymn Book Android app, covering local data storage and Google AdMob's ad-serving data collection.",
  alternates: {
    canonical: "/apps/cac-hymn-book/privacy",
  },
};

export default function CacHymnBookPrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
